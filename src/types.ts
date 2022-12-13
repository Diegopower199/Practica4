import { ObjectId } from "mongo";

export type Vendedor = {
  id: string;
  name: string;
  dni: string;
  coches: ObjectId[];
};

export type Coche = {
  id: string;
  marca: string;
  matricula: string;
  asientos: number;
  precio: number;
};

export type Concesionario = {
  id: string;
  localidad: string;
  vendedores: ObjectId[];
};
