import { CochesCollection } from "../db/dbconnection.ts";
import { CocheSchema, VendedorSchema } from "../db/schema.ts";

export const Vendedor = {
  id: (parent: VendedorSchema): string => parent._id.toString(),
  // Si quiero devolver un array de una misma coleccion debo hacerlo asi, si solo quiero devolver una cosa de una coleccion quitamos el $in y el toArray()
  coches: async (parent: VendedorSchema): Promise<CocheSchema[]> => {
    try {
      return await CochesCollection.find({ _id: { $in: parent.coches } }).toArray();
    }

    catch (error) {
      throw new Error(error);
    }

  },
};
