import { Client, CommandInteraction, TextChannel, EmbedBuilder, ActivityType, PresenceData } from 'discordjs';
import axios from 'axiod';
import { Command } from './commands/command.ts';
import { ethers  } from 'ethersjs';
import { HelpCommand } from './commands/help.ts';
import { logger } from "/deps.ts"
import { BotEvents } from './botEvents.ts';
import { CommandHandler } from './CommandHandler.ts';


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
  // async checkLatestTransaction() {
  //   try {
  //     const address = '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae';
  //     const pageSize = 100;
  //     const minValue = ethers.parseEther("8000");

  //     let currentPage = 1;
  //     let latestTx = null;
  //     let hasMorePages = true;

  //     while (hasMorePages) {
  //       const url = `https://api.etherscan.io/api?module=account&action=txlistinternal&address=${address}&startblock=0&endblock=99999999&page=${currentPage}&offset=${pageSize}&sort=desc&apikey=${etherscanApiKey}`;

  //       let response = await axios.get(url);
  //       let data = response.data as EtherscanResponse;

  //       if (data.status === "1") {
  //         latestTx = data.result.find(tx => tx.isError === "0" && BigInt(tx.value) >= minValue);

  //         if (latestTx) {
  //           break;
  //         } else if (data.result.length < pageSize) {
  //           hasMorePages = false;
  //         } else {
  //           currentPage++;
  //         }
  //       } else {
  //         console.log('Error while fetching transactions from Etherscan API');
  //         return;
  //       }
  //     }

  //     if (latestTx && latestTx.hash !== this.lastSentTxHash) {
  //       this.lastSentTxHash = latestTx.hash;
  //       this.latestTxValue = ethers.formatEther(latestTx.value);
  //       this.latestTxTimestamp = parseInt(latestTx.timeStamp);

  //       let priceResponse = await axios.get(ethPriceAPI);
  //       let usdValue = (parseFloat(this.latestTxValue) * priceResponse.data.ethereum.usd).toFixed(2);

  //       const embedMessage = new EmbedBuilder()
  // .setColor(0x0099FF)
  // .setTitle('💰 Big Ethereum Transaction Alert!')
  // .setURL(`https://etherscan.io/tx/${latestTx.hash}`)
  // .setAuthor({ name: 'Transaction Information', iconURL: 'https://etherscan.io/images/logo-ether.png' })
  // .setDescription(`The Ethereum Foundation has executed a large transaction. Here are the details:`)
  // .setThumbnail('https://etherscan.io/images/logo-ether.png')
  // .addFields(
  //   { name: '🔖 Transaction Receipt', value: `[View on Etherscan](https://etherscan.io/tx/${latestTx.hash})`, inline: true },
  //   { name: '🚀 Origin Wallet', value: `It all started at wallet: \`${latestTx.from}\``, inline: true },
  //   { name: '🎯 Destination Wallet', value: `Destination wallet: \`${latestTx.to}\``, inline: true },
  //   { 
  //     name: '💎 Transaction Value', 
  //     value: `The payload: **${parseFloat(this.latestTxValue).toLocaleString('en-US', {useGrouping: true}).replace(/,/g, ' ')} Ether** (That's approximately **$${(parseFloat(usdValue)/1000000).toFixed(2)} million**!)`, 
  //     inline: true 
  //   },
  //   { name: '\u200B', value: '\u200B' },
  // )


  // this.guilds.cache.forEach((guild) => {
  //   guild.channels.cache.forEach((channel) => {
  //     if (channel instanceof TextChannel) {
  //       channel.send({ embeds: [embedMessage] });
  //     }
  //   });
  // });
  //     } else {
  //       console.log('No transactions found for this amount');
  //     }
  //   } catch (error: unknown) {
  //     if (error instanceof Error) {
  //       console.error(`Error occurred in checkLatestTransaction: ${error.message}`);
  //     } else {
  //       console.error('An unexpected error occurred in checkLatestTransaction.');
  //     }
  //   }
  // }
 /**
   * Update the bot's presence on Discord.
   * If there are no recent transactions, log an error.
   */
  async updateBotPresence(): Promise<void> {
    try {
      // if (this.latestTxValue && this.latestTxTimestamp) {
      //   let priceResponse = await axios.get(ethPriceAPI);
      //   let usdValue = (parseFloat(this.latestTxValue) * priceResponse.data.ethereum.usd).toFixed(2);

      //   let txDate = new Date(this.latestTxTimestamp * 1000);

      //   let timeDifference = new Date().getTime() - txDate.getTime();
      //   let differenceInDays = Math.floor(timeDifference / (1000 * 3600 * 24));

      //   const presenceData: PresenceData = {
      //     activities: [{
      //       name: `$${usdValue} | ${differenceInDays} days ago`,
      //       type: ActivityType.Watching,
      //     }],
      //     status: 'online',
      //   };
      //   await this.user!.setPresence(presenceData);
      //   console.log('Bot presence updated.');
      // } else {
      //   console.error('Failed to update bot presence: No transactions found.');
      // }
    } catch (error) {
      console.error('Failed to update bot presence:', error);
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
