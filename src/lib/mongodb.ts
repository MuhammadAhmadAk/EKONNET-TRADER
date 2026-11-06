import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ekonnet_trader_db";

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export async function getMongoClient(): Promise<MongoClient> {
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 3000,
        connectTimeoutMS: 3000,
      });
      global._mongoClientPromise = client.connect().catch((err) => {
        console.warn("[MongoDB Warning] Local connection failed, fallback will be used if needed:", err.message);
        throw err;
      });
    }
    return global._mongoClientPromise;
  } else {
    if (!clientPromise) {
      client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      });
      clientPromise = client.connect();
    }
    return clientPromise;
  }
}

export async function getDatabase(dbName: string = "ekonnet_trader_db"): Promise<Db | null> {
  try {
    const connectedClient = await getMongoClient();
    return connectedClient.db(dbName);
  } catch (error) {
    return null;
  }
}
