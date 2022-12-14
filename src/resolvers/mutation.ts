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
    args: { name: string, dni: string },
  ): Promise<Vendedor> => {
    try {

      if (!/^[0-9]{8}[BCDFGHJKLMNPRSTVWXYZ]{1}$/.test(args.dni)) {
        throw new Error("El campo dni no se ha rellenado correctamente")
      }

      const vendedorDNIEncontrado = await VendedoresCollection.findOne({ dni: args.dni});

      if (vendedorDNIEncontrado) {
        throw new Error ("No puedes añadir a un vendedor con este dni, ya esta en la base de datos")
      }

      const vendedor: ObjectId = await VendedoresCollection.insertOne({
        name: args.name,
        dni: args.dni,
        coches: [],
      });

      return {
        id: vendedor.toString(),
        name: args.name,
        dni: args.dni,
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
      if (!/^[0-9]{1,4}(?!.*(LL|CH))[BCDFGHJKLMNPRSTVWXYZ]{3}$/.test(args.matricula,)) {
        throw new Error("Formato matricula incorrecto");
      }

      if (args.asientos <= 0) {
        throw new Error ("No puedes tener asientos negativos o 0 asientos")
      }

      if (args.precio <= 0) {
        throw new Error ("NO puedes tener un precio negativo o a 0");
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


      const encontrarCocheArray= encontrarVendedor.coches.find( (coches)  => {
        return coches.toString() === args.idCoche
        
      })

      if (encontrarCocheArray) {
        throw new Error ("Ya esta el id del coche en la base de datos de este vendedor")
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
          dni: encontrarVendedor.dni,
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

      
      // Para que no se repita el id en el array vendedor
      const encontrarVendedorArray= encontrarConcesionario.vendedores.find( (vendedor)  => {
        return vendedor.toString() === args.idVendedor
        
      })

      if (encontrarVendedorArray) {
        throw new Error ("Ya esta el id del vendedor en la base de datos de este concesionario")
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
      
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  },
};
