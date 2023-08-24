// @ts-ignore
import {
  logger,
  Client
} from "/deps.ts"; 


const postgresClient = new Client(Deno.env.get("DATABASE_URL"));
logger.info("Connecting to Postgres");
await postgresClient.connect();

export default postgresClient;