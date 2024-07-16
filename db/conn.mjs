import { MongoCLient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const client = new MongoCLient(process.env.ATLAS_URI);

let conn;

try {
  conn = await client.connect();
} catch (error) {
  console.log(error);
}

let db = conn.db("sample_training");

export default db;
