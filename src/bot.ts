import { Client, CommandInteraction, TextChannel, EmbedBuilder, ActivityType, PresenceData } from 'discordjs';
import axios from 'axiod';
import { Command } from './commands/command.ts';
import { ethers  } from 'ethersjs';
import { HelpCommand } from './commands/help.ts';
import { logger } from "/deps.ts"
import { BotEvents } from './botEvents.ts';
import { CommandHandler } from './CommandHandler.ts';

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
}

/**
 * Bot class that extends Client from discord.js
 * Includes functions to handle commands, check for latest transactions, and update the bot's presence.
 */
export class Bot extends Client {
  commandHandler: CommandHandler;
  botEvents: BotEvents;

  /**
   * Construct a new Bot instance.
   */
  constructor(commandHandler: CommandHandler) {
    super({ intents: [8, 11, 12] });
    this.commandHandler = commandHandler;
    this.botEvents = new BotEvents(this, this.commandHandler);
  }

    /**
   * Handle commands received by the bot.
   * @param {CommandInteraction} interaction - The command interaction.
   */
  async handleCommand(interaction: CommandInteraction) {
    if (interaction.commandName === 'help') {
      const command = new HelpCommand();
      await command.execute(interaction);
    }
  }

   /**
   * Check for the latest transaction from the Ethereum Foundation.
   * If a transaction meets the conditions and is different from the last one, an embed message is sent in all text channels.
   */
  async sendAlert(latestTx) {
    try {
      
      const embedMessage = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('💰 Big Ethereum Transaction Alert!')
        .setURL(`https://etherscan.io/tx/${latestTx.hash}`)
        .setAuthor({ name: 'Transaction Information', iconURL: 'https://etherscan.io/images/logo-ether.png' })
        .setDescription(`The Ethereum Foundation has executed a large transaction. Here are the details:`)
        .setThumbnail('https://etherscan.io/images/logo-ether.png')
        .addFields(
          { name: '🔖 Transaction Receipt', value: `[View on Etherscan](https://etherscan.io/tx/${latestTx.hash})`, inline: true },
          { name: '🚀 Origin Wallet', value: `It all started at wallet: \`${latestTx.from}\``, inline: true },
          { name: '🎯 Destination Wallet', value: `Destination wallet: \`${latestTx.to}\``, inline: true },
          { 
            name: '💎 Transaction Value', 
            value: `The payload: **${parseFloat(latestTx.value).toLocaleString('en-US', {useGrouping: true}).replace(/,/g, ' ')} Ether**`, 
            inline: true 
          },
          { name: '\u200B', value: '\u200B' },
        )


      const CHANNEL_ID = Deno.env.get('CHANNEL_ID');
      const channel = await this.channels.fetch(CHANNEL_ID!);
      if (channel instanceof TextChannel) {
        await channel.send({ embeds: [embedMessage] });
      }
      
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error occurred in sendAlert: ${error.message}`);
      } else {
        console.error('An unexpected error occurred in sendAlert.');
      }
    }
  }


  /**
   * Starts the bot.
   */
  public async start() {
    try {

      await this.login(Deno.env.get('DISCORD_BOT_TOKEN'));
      logger.info('Logged in successfully');
    } catch (error: any) {
      console.error('Error starting the bot:', error.message);
    }
  }
}

const commandHandler = new CommandHandler();
const bot = new Bot(commandHandler);

export default bot;