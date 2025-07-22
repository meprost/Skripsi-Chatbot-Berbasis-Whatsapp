import { Chat } from 'whatsapp-web.js';

export interface Command {
  name: string;
  shortDescription: string;
  description: string;
  logo: string;
  handler: CommandHandler;
}

export type CommandHandler = (
  chat: Chat,
  args: string[],
  command: Command,
) => Promise<void>;
