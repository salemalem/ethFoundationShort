import { 
  logger,
  provider,
  ethers,
  multisigContract,
} from "/deps.ts";

export async function getTransactionValue(transactionHash: string): Promise<ethers.BigNumber> {
  const receipt = await provider.getTransactionReceipt(transactionHash);
  const parsedLogs = multisigContract.interface.parseLog(receipt.logs[1]);
  const txValue = parsedLogs.args[2];
  const receiver = parsedLogs.args[3];

  return txValue;
}

