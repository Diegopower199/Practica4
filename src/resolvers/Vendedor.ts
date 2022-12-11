import { CochesCollection } from "../db/dbconnection.ts";
import { CocheSchema, VendedorSchema } from "../db/schema.ts";
import { Coche } from "../types.ts";

export const Vendedor = {
  coches: async (parent: VendedorSchema): Promise<Coche[]> => {
    console.log(parent.coches);
    const coches: CocheSchema[] | undefined = await CochesCollection.find(
      { coches: { $in: parent.coches } },
    ).toArray();

    console.log(coches);

    return coches.map((coche: CocheSchema) => ({
      id: coche._id.toString(),
      marca: coche.marca,
      matricula: coche.matricula,
      asientos: coche.asientos,
      precio: coche.precio,
    }));
  },
};
