import { Message } from 'whatsapp-web.js';

import logger from '@/lib/logger';

import { Command } from './types';
import userCommands from './user-commands';
import { commandParser } from './utils';

const userCommandHandler = async (message: Message) => {
  const { command: commandFromUser, args } = commandParser(message.body);

  const findCommand = (cmd: Command) =>
    cmd.name === `${commandFromUser?.replace('/', '')}`;

  const command = userCommands.find(findCommand);

  if (command) {
    logger.info(
      {
        from: message.from.replace('@c.us', ''),
        command: commandFromUser,
        args,
      },
      '[User Command]',
    );

    const chat = await message.getChat();

    await command.handler(chat, args, command);
  } else {
    logger.warn(
      { command: commandFromUser, args },
      '[User Command]: Not Found',
    );

    const chat = await message.getChat();

    await chat.sendMessage(
      'Perintah tidak dikenali! ketik /menu untuk melihat semua perintah',
    );
  }
};

export default userCommandHandler;
