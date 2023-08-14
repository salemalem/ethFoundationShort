import { ethers, InfuraProvider, Contract } from "npm:ethers@6.7.0";
import MultisigABI from "./Multisig.abi.json" assert { type: "json" };
import Logger from "https://deno.land/x/logger@v1.1.1/logger.ts";
const logger = new Logger();

logger.info("Starting txReader");
// read transaction using ethers js
const provider = new InfuraProvider("homestead", "d4a52007f10e41d2afa76c5ad167f6bf");
const headers = {
  'content-type': 'application/json',
};

const tx = await provider.getTransaction("0x22dbf6ddbaf25a394c70cbd937c21b82f57352ea2cf1c849c727a160dc5fa76f");
// logger.info(tx);
const iface = new ethers.Interface(MultisigABI);
const decodedData = iface.parseTransaction({ data: tx.data, value: tx.value });
logger.info(decodedData);


// const abiTransfer = [
//   "event Transfer(address indexed src, address indexed dst, uint val)"
// ];

const multisigAddress = "0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae";
const multisigContract = new Contract(multisigAddress, MultisigABI, provider);
// const transfers = multisigContract.filters.Execute();
// logger.info(transfers);

const eventSignature: string = 'confirm(bytes32)';
const eventTopic: string = ethers.id(eventSignature); // Get the data hex string
const jsonBody = `{
  "jsonrpc": "2.0",
  "id": 1,
  "method":"eth_getLogs",
  "params": [{
    "fromBlock": "0x0",
    "address": "${multisigAddress}",
    "topics": ["0xe1c52dc63b719ade82e8bea94cc41a0d5d28e4aaf536adb5e9cccc9ff8c1aeda"]
  }]
}`;

const infuraURL = "https://mainnet.infura.io/v3/d4a52007f10e41d2afa76c5ad167f6bf";

async function getLogs() {
  console.log(`Getting the PunkTransfer events...`);




  // const rawLogs = await provider.getLogs({
  //   address: multisigAddress,
  //   topics: [eventTopic]
  // });

  // const rawLogs = await provider.getLogs({
  //   address: multisigAddress,
  //   topics: ['0xe1c52dc63b719ade82e8bea94cc41a0d5d28e4aaf536adb5e9cccc9ff8c1aeda']
  // });

  // const rawLogs = await provider.send('eth_getLogs', {
  //   address: multisigAddress,
  //   topics: ['0xe1c52dc63b719ade82e8bea94cc41a0d5d28e4aaf536adb5e9cccc9ff8c1aeda']
  // });

  logger.info(jsonBody);
  // logger.info(jsonRPCrequest);
  const resp = await fetch(infuraURL, {
    method: 'POST',
    headers,
    body: jsonBody,
  });
  logger.info(await resp.json());
}

getLogs();