import { VendedoresCollection } from "../db/dbconnection.ts";
import { ConcesionarioSchema, VendedorSchema } from "../db/schema.ts";

export const Concesionario = {
  vendedores: async (
    parent: ConcesionarioSchema,
  ): Promise<VendedorSchema[]> => {
    return await VendedoresCollection.find({ _id: { $in: parent.vendedores } })
      .toArray();
  },
};
