import { ObjectId } from "mongo";
import {
  CochesCollection,
  ConcesionariosCollection,
  VendedoresCollection,
} from "../db/dbconnection.ts";
import {
  CocheSchema,
  ConcesionarioSchema,
  VendedorSchema,
} from "../db/schema.ts";
import { Coche, Concesionario, Vendedor } from "../types.ts";

export const Query = {
  getConcesionarioPorId: async (
    _: unknown,
    args: { id: string },
  ): Promise<Concesionario | null> => {
    const concesionarioExiste: ConcesionarioSchema | undefined =
      await ConcesionariosCollection.findOne({
        _id: new ObjectId(args.id),
      });

    if (!concesionarioExiste) {
      throw new Error("No existe un concesionario con esa ID");
    }
    return {
      id: args.id,
      localidad: concesionarioExiste.localidad,
      vendedores: concesionarioExiste.vendedores,
    };
  },

  getConcesionarioPorLocalidad: async (
    _: unknown,
    args: { localidad: string },
  ): Promise<Concesionario[]> => {
    const concesionarioExiste: ConcesionarioSchema[] | undefined =
      await ConcesionariosCollection.find({
        localidad: args.localidad,
      }).toArray();

    if (!concesionarioExiste) {
      throw new Error("No existe un concesionario en esa localidad");
    }

    return concesionarioExiste.map((concesionario: ConcesionarioSchema) => ({
      id: concesionario._id.toString(),
      localidad: concesionario.localidad,
      vendedores: concesionario.vendedores,
    }));
  },

  getVendedorPorId: async (
    _: unknown,
    args: { id: string },
  ): Promise<Vendedor | null> => {
    try {
      const vendedor: VendedorSchema | undefined = await VendedoresCollection
        .findOne({
          _id: new ObjectId(args.id),
        });
      if (!vendedor) throw new Error("Vendedor no encontrado");

      return {
        id: vendedor._id.toString(),
        name: vendedor.name,
        coches: vendedor.coches,
      };

      //return { ...vendedor };
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  },

  getVendedoresNombres: async (
    _: unknown,
    args: { name: string },
  ): Promise<Vendedor[]> => {
    try {
      const vendedores: VendedorSchema[] = await VendedoresCollection.find({
        name: args.name,
      })
        .toArray();
      if (!vendedores) {
        throw new Error("Vendedores con ese nombre no existentes");
      }

      return vendedores.map((vendedor: VendedorSchema) => ({
        id: vendedor._id.toString(),
        name: vendedor.name,
        coches: vendedor.coches,
      }));
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  },

  getCochePorId: async (
    _: unknown,
    args: { id: string },
  ): Promise<Coche | null> => {
    try {
      const coche: CocheSchema | undefined = await CochesCollection.findOne({
        _id: new ObjectId(args.id),
      });
      if (!coche) throw new Error("Coche no encontrado");

      return {
        id: coche._id.toString(),
        marca: coche.marca,
        matricula: coche.matricula,
        asientos: coche.asientos,
        precio: coche.precio,
      };
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  },
  getCochePorRangoPrecio: async (
    _: unknown,
    args: { precioMin: number; precioMax: number },
  ): Promise<Coche[]> => {
    try {
      const coches: CocheSchema[] = await CochesCollection.find({
        precio: {
          $gte: args.precioMin, // Mayor o igual que el minimo
          $lte: args.precioMax, // Menor o igual que el maximo
        },
      }).toArray();

      if (!coches) throw new Error("No hay coches en ese rango de precio");

      // quiero que en cada coche que me devuelva, me devuelva el id como string
      return coches.map((coche: CocheSchema) => ({
        id: coche._id.toString(),
        marca: coche.marca,
        matricula: coche.matricula,
        asientos: coche.asientos,
        precio: coche.precio,
      }));
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  },
};
