export { 
  ethers, 
  InfuraProvider, 
  Contract 
} from "ethersjs";
import Logger from "https://deno.land/x/logger@v1.1.1/logger.ts";
const logger = new Logger();
export { logger };

import { load } from 'dotenv';
const loadEnv = await load({
  envPath: './.env',
  export: true,
  examplePath: './.env.example',
  allowEmptyValues: false,
});