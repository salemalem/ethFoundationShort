import CONFIG from "/config.json" assert { type: "json" };
import { 
  logger,
  multisigAddress,
  infuraURL,
} from "/deps.ts";

const headers = {
  'content-type': 'application/json',
};



export async function getTopicLogs(transaction_type: string): Promise<JSON> {
  if (transaction_type !== "confirmation" && transaction_type !== "multitransact") {
    const error = "getTopicLogs. Invalid transaction type!"
    logger.error(error);
    throw new Error(error);
  }
  try {
    const target_topic = CONFIG.topics[transaction_type];
    const jsonBody = `{
      "jsonrpc": "2.0",
      "id": 1,
      "method":"eth_getLogs",
      "params": [{
        "fromBlock": "0x0",
        "address": "${multisigAddress}",
        "topics": [
          "${target_topic}"
        ]
      }]
    }`;
    const resp = await fetch(infuraURL, {
      method: 'POST',
      headers,
      body: jsonBody,
    });
    return await resp.json();
  } catch (error) {
    logger.error(error);
    throw new Error(error);
  }
}
