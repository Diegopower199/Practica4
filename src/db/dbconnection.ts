import { Collection, Database, MongoClient } from "mongo";

import { config } from "std/dotenv/mod.ts";
import { CocheSchema, ConcesionarioSchema, VendedorSchema } from "./schema.ts";

await config({ export: true, allowEmptyValues: true });

const connectMongoDB = async (): Promise<Database> => {
  const mongo_url = Deno.env.get("MONGO_URL");

  if (!mongo_url) {
    throw new Error(
      "Missing environment variables, check env.sample for creating .env file",
    );
  }

  const client = new MongoClient();
  await client.connect(mongo_url);
  const db = client.database("Practica4");
  return db;
};

const db = await connectMongoDB();
console.info(`MongoDB Practica4 connected`);

export const CochesCollection: Collection<CocheSchema> = db.collection<
  CocheSchema
>("Coches");
export const VendedoresCollection: Collection<VendedorSchema> = db.collection<
  VendedorSchema
>("Vendedores");
export const ConcesionariosCollection: Collection<ConcesionarioSchema> = db
  .collection<ConcesionarioSchema>(
    "Concesionarios",
  );
