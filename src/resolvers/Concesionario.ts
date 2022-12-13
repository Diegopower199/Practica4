import { VendedoresCollection } from "../db/dbconnection.ts";
import { ConcesionarioSchema, VendedorSchema } from "../db/schema.ts";

export const Concesionario = {
  vendedores: async (
    parent: ConcesionarioSchema,
  ): Promise<VendedorSchema[]> => {
    try {
      return await VendedoresCollection.find({ _id: { $in: parent.vendedores } }).toArray();
    }

    catch (error) {
      throw new Error(error);
    }
  },
};
