import { 
  multisigAddress,
  multisigContract,
  provider,
  logger,
  ethers,
} from "./deps.ts";
import MultisigABI from "./Multisig.abi.json" assert { type: "json" };

logger.info("Starting txReader");
// read transaction using ethers js

const tx = await provider.getTransaction("0x7b6964ecd915cf390905b5f96fc004784f4519f055b7e0cead691f3b8f963b3d");
// logger.info(tx);
const iface = new ethers.Interface(MultisigABI);
const decodedData = iface.parseTransaction({ data: tx.data, value: tx.value });
logger.info(decodedData);









