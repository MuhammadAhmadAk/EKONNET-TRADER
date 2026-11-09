import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ekonnet_trader_db";

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export async function getMongoClient(): Promise<MongoClient> {
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri, {
      maxPoolSize: 50,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000,
    });
    global._mongoClientPromise = client.connect().catch((err) => {
      console.warn("[MongoDB Warning] Connection failed, will retry on next query:", err.message);
      global._mongoClientPromise = undefined;
      throw err;
    });
  }
  return global._mongoClientPromise;
}

export async function getDatabase(dbName: string = "ekonnet_trader_db"): Promise<Db | null> {
  try {
    const connectedClient = await getMongoClient();
    return connectedClient.db(dbName);
  } catch (error) {
    return null;
  }
}
