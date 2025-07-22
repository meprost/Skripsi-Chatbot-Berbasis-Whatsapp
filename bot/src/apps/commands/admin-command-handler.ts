import { Message } from 'whatsapp-web.js';

import logger from '@/lib/logger';

import { sendMessageToAdmin } from '../messages/utils';

import adminCommands from './admin-commands';
import { Command } from './types';
import { commandParser } from './utils';

const adminCommandHandler = async (message: Message) => {
  const { command: commandFromAdmin, args } = commandParser(message.body);

  const findCommand = (cmd: Command) =>
    cmd.name === `${commandFromAdmin?.replace('/', '')}`;

  const command = adminCommands.find(findCommand);

  if (command) {
    logger.info({ command: commandFromAdmin, args }, '[Admin Command]');

    const chat = await message.getChat();

    await command.handler(chat, args, command);
  } else {
    logger.warn(
      { command: commandFromAdmin, args },
      '[Admin Command]: Not Found',
    );

    await sendMessageToAdmin(
      'Perintah tidak dikenali! ketik /menu untuk melihat semua perintah',
    );
  }
};

export default adminCommandHandler;
