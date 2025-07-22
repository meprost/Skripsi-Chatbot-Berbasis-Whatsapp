FROM node:lts-alpine3.21 AS base

WORKDIR /usr/app

ENV TZ=Asia/Jakarta

# DEVELOPMENT

FROM base AS dev

COPY package*.json .

RUN --mount=type=bind,source=package.json,target=package.json \
  --mount=type=bind,source=package-lock.json,target=package-lock.json \
  --mount=type=cache,target=/usr/app/.npm \
  npm set cache /usr/app/.npm && \
  npm ci --foreground-scripts 

COPY . .

CMD ["npm", "run", "dev"]

# BUILD FOR PROD

FROM base AS build

RUN --mount=type=bind,source=package.json,target=package.json \
  --mount=type=bind,source=package-lock.json,target=package-lock.json \
  --mount=type=cache,target=/usr/app/.npm \
  npm set cache /usr/app/.npm && \
  npm ci --foreground-scripts 

COPY . .

RUN npm run build 

# PRODUCTION

FROM base AS prod

RUN chown node:node /usr/app 
USER node

ENV NODE_ENV=production

# Copy dist (from build stage)
COPY --chown=node:node --from=build /usr/app/dist dist

RUN --mount=type=bind,source=package.json,target=package.json \
  --mount=type=bind,source=package-lock.json,target=package-lock.json \
  --mount=type=cache,target=/usr/app/.npm \
  npm set cache /usr/app/.npm && \
  npm ci --include=dev --foreground-scripts 

COPY . .

CMD ["node", "dist/src/index.js"]
