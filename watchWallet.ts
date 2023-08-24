import { getTopicLogs } from '/utils/getTopicLogs.ts';
import { 
  logger,
} from '/deps.ts';
import postgresClient from "/db/postgreClient.ts";


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
      // const insertQuery = `INSERT INTO "wallet_txs" ("hash", "type") VALUES ('${txHash}', '${txType}')`;
      // postgresQuery = await postgresClient.queryArray(insertQuery);
      
    }  
  } catch (error) {
    logger.error(error);
  }
}

logger.info('Starting to watch Ethereum Dev wallet...');
watchWallet();
