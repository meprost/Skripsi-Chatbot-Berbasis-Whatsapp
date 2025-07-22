import { Client, LocalAuth } from 'whatsapp-web.js';

const whatsappClient = new Client({
  puppeteer: {
    executablePath: '/usr/bin/google-chrome-stable',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      // '--disable-dev-shm-usage',
      // '--disable-gpu',
    ],
  },
  authStrategy: new LocalAuth({
    dataPath: '.misc/whatsapp-web-client',
  }),
});

export default whatsappClient;
