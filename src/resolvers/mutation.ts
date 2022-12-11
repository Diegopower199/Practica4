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

export const Mutation = {
  crearVendedor: async (
    _: unknown,
    args: { name: string },
  ): Promise<Vendedor> => {
    try {
      const vendedor: ObjectId = await VendedoresCollection.insertOne({
        name: args.name,
        coches: [],
      });

      return {
        id: vendedor.toString(),
        name: args.name,
        coches: [],
      };
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  },
  crearCoche: async (
    _: unknown,
    args: {
      marca: string;
      matricula: string;
      asientos: number;
      precio: number;
    },
  ): Promise<Coche> => {
    try {
      if (
        !/^[0-9]{1,4}(?!.*(LL|CH))[BCDFGHJKLMNPRSTVWXYZ]{3}$/.test(
          args.matricula,
        )
      ) {
        throw Error("Formato matricula incorrecto");
      }

      const matriculaEncontrada: CocheSchema | undefined =
        await CochesCollection.findOne({
          matricula: args.matricula,
        });
      if (matriculaEncontrada) {
        throw new Error("Ya existe un coche con esa matricula");
      }

      const coche: ObjectId = await CochesCollection.insertOne({
        marca: args.marca,
        matricula: args.matricula,
        asientos: args.asientos,
        precio: args.precio,
      });
      return {
        id: coche.toString(),
        marca: args.marca,
        matricula: args.matricula,
        asientos: args.asientos,
        precio: args.precio,
      };
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  },

  crearConcesionario: async (
    _: unknown,
    args: { localidad: string },
  ): Promise<Concesionario> => {
    try {
      const concesionario: ObjectId = await ConcesionariosCollection.insertOne({
        localidad: args.localidad,
        vendedores: [],
      });

      return {
        id: concesionario.toString(),
        localidad: args.localidad,
        vendedores: [],
      };
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  },

  anadirCocheAUnVendedor: async (
    _: unknown,
    args: { idCoche: string; idVendedor: string },
  ): Promise<Vendedor> => {
    try {
      const encontrarCoche: CocheSchema | undefined = await CochesCollection
        .findOne({ _id: new ObjectId(args.idCoche) });

      console.log("\nencontrarCoche: ", encontrarCoche?._id);

      const encontrarVendedor: VendedorSchema | undefined =
        await VendedoresCollection.findOne({
          _id: new ObjectId(args.idVendedor),
        });
      const { _idCoche, _idVendedor } = {
        _idCoche: args.idCoche,
        _idVendedor: args.idVendedor,
      };

      console.log(
        "args.idCoche: ",
        args.idCoche,
        "\nargs.idVendedor: ",
        args.idVendedor,
      );

      if (!encontrarCoche || !encontrarVendedor) {
        throw new Error("No se encuentra el id del coche o del vendedor");
      }

      const vendedor = await VendedoresCollection.updateOne(
        { _id: new ObjectId(args.idVendedor) },
        {
          $push: {
            coches: {
              $each: [new ObjectId(args.idCoche)],
            },
          },
        },
      );

      if (vendedor) {
        return {
          id: encontrarVendedor._id.toString(),
          name: encontrarVendedor.name,
          coches: encontrarVendedor.coches,
        };
      } else {
        throw new Error("NO se ha podido modificar al vendedor");
      }

      /*return {
          id: args.idVendedor,
        }*/

      /*const vendedor = await VendedoresCollection.updateOne (
                {_id: new ObjectId (args.idVendedor)},
                { $push: { coches: new ObjectId(coches._id)}}

            );*/
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  },

  anadirVendedorAUnConcesionario: async (
    _: unknown,
    args: { idConcesionario: string; idVendedor: string },
  ): Promise<Concesionario> => {
    try {
      const encontrarConcesionario: ConcesionarioSchema | undefined =
        await ConcesionariosCollection.findOne({
          _id: new ObjectId(args.idConcesionario),
        });

      const encontrarVendedor: VendedorSchema | undefined =
        await VendedoresCollection
          .findOne({ _id: new ObjectId(args.idVendedor) });

      console.log(
        "Encontrar concesionario: ",
        encontrarConcesionario?._id,
        "\nEncontrar vendedor: ",
        encontrarVendedor?._id,
      );

      const { _idConcesionario, _idVendedor } = {
        _idConcesionario: args.idConcesionario,
        _idVendedor: args.idVendedor,
      };

      if (!encontrarConcesionario || !encontrarVendedor) {
        throw new Error(
          "No se encuentra el id del concesionario o del vendedor",
        );
      }

      const concesionario = await ConcesionariosCollection.updateOne(
        { _id: new ObjectId(args.idConcesionario) },
        {
          $push: {
            vendedores: {
              $each: [new ObjectId(args.idVendedor)],
            },
          },
        },
      );

      if (concesionario) {
        return {
          id: encontrarConcesionario._id.toString(),
          localidad: encontrarConcesionario.localidad,
          vendedores: encontrarConcesionario.vendedores,
        };
      } else {
        throw new Error("NO se ha podido modificar al vendedor");
      }

      /*return {
          id: args.idVendedor,
        }*/

      /*const vendedor = await VendedoresCollection.updateOne (
                {_id: new ObjectId (args.idVendedor)},
                { $push: { coches: new ObjectId(coches._id)}}

            );*/
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  },
};
