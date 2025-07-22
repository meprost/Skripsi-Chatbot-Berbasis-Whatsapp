import { CommandHandler } from '../types';
import userCommands from '../user-commands';

const userMenuCommandHandler: CommandHandler = async (chat) => {
  await chat.sendStateTyping();
  const messages: string[] = [];

  messages.push(`╭─〔 *Welcome To Joki Fatkhi* 〕─\n`);
  messages.push(`┊ \n`);
  userCommands.map((command) => {
    messages.push(
      `┊ ${command.logo} */${command.name}* ➜ ${command.shortDescription}\n`,
    );
  });
  messages.push(`┊ \n`);
  messages.push(`╰───────────────\n\n`);
  messages.push('⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️\n\n');
  messages.push(`*KETIK /produk SEBELUM MELAKUKAN PEMESANAN*\n`);
  messages.push(`*KETIK PERINTAH DIATAS UNTUK MENGGUNAKAN BOT*\n\n`);
  messages.push('⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️\n\n');
  messages.push(`*CONTOH: /caraorder*`);

  await chat.sendMessage(messages.join(''));
};

export default userMenuCommandHandler;
