import { ObjectId } from "mongo";
import { Coche, Vendedor, Concesionario } from "../types.ts";

export type CocheSchema = Omit<Coche, "id"> & {
    _id: ObjectId;
};

export type VendedorSchema = Omit<Vendedor, "id"> & {
    _id: ObjectId;
};

export type ConcesionarioSchema = Omit<Concesionario, "id"> & {
    _id: ObjectId;
};