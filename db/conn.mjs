import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.ATLAS_URI);

async function connectMongo() {
  let conn;

  try {
    conn = await client.connect();
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }

  const db = conn.db("sample_training");
  return db;
}

const db = await connectMongo();
export default db;
