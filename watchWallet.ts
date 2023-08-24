import { getTopicLogs } from '/utils/getTopicLogs.ts';
import { 
  logger,
} from '/deps.ts';
import postgresClient from "/db/postgreClient.ts";

logger.info('Starting to watch Ethereum Dev wallet...');
// const txHash = 1;
// const txType = 1;
// const insertQuery = `INSERT INTO "wallet_txs" ("hash", "type") VALUES ('${txHash}', '${txType}')`;
// const postgresQuery = await postgresClient.queryArray(insertQuery);
