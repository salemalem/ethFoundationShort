import { 
  ethers, 
  InfuraProvider, 
  Contract 
} from "ethersjs";
export {
  ethers,
}
import Logger from "https://deno.land/x/logger@v1.1.1/logger.ts";
export const logger = new Logger();

import { load } from 'dotenv';
export const loadEnv = await load({
  envPath: './.env',
  export: true,
  examplePath: './.env.example',
  allowEmptyValues: false,
});

export const provider = new InfuraProvider("homestead", Deno.env.get("INFURA_API_KEY"));

import MultisigABI from "./Multisig.abi.json" assert { type: "json" };
export const multisigAddress = "0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae";
export const multisigContract = new Contract(multisigAddress, MultisigABI, provider);


export const infuraURL = `https://mainnet.infura.io/v3/${Deno.env.get("INFURA_API_KEY")}`;