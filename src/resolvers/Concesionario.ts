import { VendedoresCollection } from "../db/dbconnection.ts";
import { ConcesionarioSchema, VendedorSchema } from "../db/schema.ts";
import { Vendedor } from "../types.ts";

export const Concesionario = {
  vendedores: async (parent: ConcesionarioSchema): Promise<Vendedor[]> => {
    const vendedores: VendedorSchema[] = await VendedoresCollection.find(
      { vendedores: { $nin: parent.vendedores } },
    ).toArray();

    return vendedores.map((vendedores: VendedorSchema) => ({
      id: vendedores._id.toString(),
      name: vendedores.name,
      coches: vendedores.coches,
    }));
  },
};
