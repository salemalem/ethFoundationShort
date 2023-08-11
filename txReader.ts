import { ethers, InfuraProvider } from "npm:ethers@6.7.0";
import MultisigABI from "./Multisig.abi.json" assert { type: "json" };
import Logger from "https://deno.land/x/logger@v1.1.1/logger.ts";
const logger = new Logger();

logger.info("Starting txReader");
// read transaction using ethers js
const provider = new InfuraProvider("homestead", "d4a52007f10e41d2afa76c5ad167f6bf");
const tx = await provider.getTransaction("0x22dbf6ddbaf25a394c70cbd937c21b82f57352ea2cf1c849c727a160dc5fa76f");
// logger.info(tx);
const iface = new ethers.Interface(MultisigABI);
const decodedData = iface.parseTransaction({ data: tx.data, value: tx.value });
logger.info(decodedData);
