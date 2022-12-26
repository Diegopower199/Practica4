import { CocheSchema } from "../db/schema.ts";

export const Coche = {
  id: (parent: CocheSchema): string => parent._id.toString(),

}