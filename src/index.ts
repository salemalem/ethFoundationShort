import { Bot } from './bot.ts';
import { logger } from '/deps.ts';
import { BotEvents } from './botEvents.ts';
import { CommandHandler } from './CommandHandler.ts';

logger.info('Starting Eth Foundation bot...');
const commandHandler = new CommandHandler();
const bot = new Bot(commandHandler);
bot.start();