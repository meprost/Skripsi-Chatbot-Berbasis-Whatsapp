import { sendMessageToAdmin } from '@/apps/messages/utils';

import adminCommands from '../admin-commands';
import { CommandHandler } from '../types';

const adminMenuCommandHandler: CommandHandler = async () => {
  const messages: string[] = [];

  messages.push(`╭─〔 *Welcome Boss!* 〕─\n`);
  messages.push(`┊ \n`);
  adminCommands.map((command) => {
    messages.push(
      `┊ ${command.logo} */${command.name}* ➜ ${command.shortDescription}\n`,
    );
  });
  messages.push(`┊ \n`);
  messages.push(`╰───────────────\n\n`);
  messages.push(`KETIK PERINTAH DIATAS UNTUK MENGGUNAKAN BOT\n\n`);
  messages.push(`*CONTOH: /konfirmasi nomorPelanggan*`);

  await sendMessageToAdmin(messages.join(''));
};

export default adminMenuCommandHandler;
