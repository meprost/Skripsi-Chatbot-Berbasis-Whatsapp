FROM node:lts-slim AS base

WORKDIR /app

ENV TZ=Asia/Jakarta 

# Canvas dependencies for generating qr
# RUN apt-get update && \
#   apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev 

# Puppeteer dependencies for wwjs
RUN apt-get update && \
  apt-get install -y gconf-service libgbm-dev libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget 

# We don't need the standalone Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true 

# Install Google Chrome Stable and fonts
# Note: this installs the necessary libs to make the browser work with Puppeteer.
RUN apt-get update && apt-get install gnupg wget -y && \
  wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
  sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
  apt-get update && \
  apt-get install google-chrome-stable -y --no-install-recommends && \
  rm -rf /var/lib/apt/lists/* 

# DEVELOPMENT
FROM base AS dev 

# RUN mkdir -p /app/node_modules && chown -R node:node /app 
# USER node 

COPY package*.json .

RUN --mount=type=bind,source=package.json,target=package.json \
  --mount=type=bind,source=package-lock.json,target=package-lock.json \
  --mount=type=cache,target=/app/.npm \
  npm set cache /app/.npm && \
  npm ci --foreground-scripts 

COPY . .

CMD ["npm", "run", "dev"]

# BULD FOR PROD
FROM base AS build 

RUN --mount=type=bind,source=package.json,target=package.json \
  --mount=type=bind,source=package-lock.json,target=package-lock.json \
  --mount=type=cache,target=/app/.npm \
  npm set cache /app/.npm && \
  npm ci --foreground-scripts 

COPY . .

RUN npm run build 

# PRODUCTION
FROM base AS prod 

# Change user to node and chown /app dir to node
RUN chown node:node /app 
USER node 

ENV NODE_ENV=production

# Copy assets and dist (from build stage)
COPY --chown=node:node ./assets /app/assets
COPY --chown=node:node --from=build /app/dist /app/dist

RUN --mount=type=bind,source=package.json,target=package.json \
  --mount=type=bind,source=package-lock.json,target=package-lock.json \
  --mount=type=cache,target=/app/.npm \
  npm set cache /app/.npm && \
  npm ci --omit=dev --foreground-scripts 

CMD ["node", "dist/src/index.js"]
