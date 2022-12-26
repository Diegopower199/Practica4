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
  ): Promise<ConcesionarioSchema | null> => {
    const concesionarioExiste: ConcesionarioSchema | undefined =
      await ConcesionariosCollection.findOne({
        _id: new ObjectId(args.id),
      });

    if (!concesionarioExiste) {
      throw new Error("No existe un concesionario con esa ID");
    }
    return {
      _id: concesionarioExiste._id,
      localidad: concesionarioExiste.localidad,
      vendedores: concesionarioExiste.vendedores,
    };
  },

  getConcesionarioPorLocalidad: async (
    _: unknown,
    args: { localidad: string },
  ): Promise<ConcesionarioSchema[]> => {
    const concesionarioExiste: ConcesionarioSchema[] | undefined =
      await ConcesionariosCollection.find({
        localidad: args.localidad,
      }).toArray();

    if (!concesionarioExiste) {
      throw new Error("No existe un concesionario en esa localidad");
    }

    return concesionarioExiste.map((concesionario: ConcesionarioSchema) => ({
      _id: concesionario._id,
      localidad: concesionario.localidad,
      vendedores: concesionario.vendedores,
    }));
  },

  getVendedorPorId: async (
    _: unknown,
    args: { id: string },
  ): Promise<VendedorSchema | null> => {
    try {
      const vendedor: VendedorSchema | undefined = await VendedoresCollection
        .findOne({
          _id: new ObjectId(args.id),
        });
      if (!vendedor) throw new Error("Vendedor no encontrado");

      return {
        _id: vendedor._id,
        name: vendedor.name,
        dni: vendedor.dni,
        coches: vendedor.coches,
      };

      //return { ...vendedor };
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  },

  getVendedorPorNombre: async (
    _: unknown,
    args: { name: string },
  ): Promise<VendedorSchema[]> => {
    try {
      const vendedores: VendedorSchema[] = await VendedoresCollection.find({
        name: args.name,
      })
        .toArray();
      if (!vendedores) {
        throw new Error("Vendedores con ese nombre no existentes");
      }

      return vendedores.map((vendedor: VendedorSchema) => ({
        _id: vendedor._id,
        name: vendedor.name,
        dni: vendedor.dni,
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
  ): Promise<CocheSchema | null> => {
    try {
      const coche: CocheSchema | undefined = await CochesCollection.findOne({
        _id: new ObjectId(args.id),
      });
      if (!coche) throw new Error("Coche no encontrado");

      return {
        _id: coche._id,
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
  ): Promise<CocheSchema[]> => {
    try {

      if (args.precioMin < 0 || args.precioMax < 0) {
        throw new Error ("El parametro precioMin o precioMax no pueden tener valores negativos");
      }
      const coches: CocheSchema[] = await CochesCollection.find({
        precio: {
          $gte: args.precioMin, // Mayor o igual que el minimo
          $lte: args.precioMax, // Menor o igual que el maximo
        },
      }).toArray();


      if (!coches) throw new Error("No hay coches en ese rango de precio");

      if (args.precioMin < 0 || args.precioMax < 0) {
        throw new Error("El precio minimo o el precio maximo no pueden ser negativos");
      }

      if (args.precioMax < args.precioMin) {
        throw new Error("El precio maximo es menor que el precio minimo");
      }

      // quiero que en cada coche que me devuelva, me devuelva el id como string
      return coches.map((coche: CocheSchema) => ({
        _id: coche._id,
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
