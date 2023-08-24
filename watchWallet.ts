import { getTopicLogs } from '/utils/getTopicLogs.ts';
import { getTransactionValue } from './utils/getTransactionValue.ts';
import { 
  logger,
  ethers,
  BigNumber
} from '/deps.ts';
import postgresClient from "/db/postgreClient.ts";
import CONFIG from "/config.json" assert { type: "json" };


async function watchWallet() {
  try {
    const txs = (await getTopicLogs("multitransact")).result;
    for (const tx of txs) {
      const txHash = tx.transactionHash;

      const sqlQuery = `SELECT EXISTS(SELECT 1 FROM "wallet_txs" WHERE "hash"='${txHash}')`;
      let postgresQuery = await postgresClient.queryArray(sqlQuery);
      const postgreResult = postgresQuery.rows[0][0];
      if (postgreResult === true) {
        logger.info('Transaction already in database');
        continue;
      }
      const txType = "multitransact";
      let txValue = await getTransactionValue(txHash);
      txValue = BigNumber.from(txValue);
      let requiredValue = CONFIG.trigger_requirements.minimum_value;
      requiredValue = BigNumber.from(requiredValue);
      const ethDecimals = BigNumber.from(10).pow(18);
      requiredValue = requiredValue.mul(ethDecimals); // decimals of ETH
      logger.info(`Transaction value: ${txValue}, required value: ${requiredValue}`);
      if (txValue.gt(requiredValue)) {
        logger.info(`Transaction value: ${txValue} is greater than required value: ${requiredValue}`);
        logger.info(`New transaction: ${txHash} with value ${txValue}`);
        // const insertQuery = `INSERT INTO "wallet_txs" ("hash", "type") VALUES ('${txHash}', '${txType}')`;
        // postgresQuery = await postgresClient.queryArray(insertQuery);
      }
    }  
  } catch (error) {
    logger.error(error);
  }
}

logger.info('Starting to watch Ethereum Dev wallet...');
watchWallet();
