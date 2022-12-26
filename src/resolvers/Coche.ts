import { CocheSchema } from "../db/schema.ts";

export const Vendedor = {
  id: (parent: CocheSchema): string => parent._id.toString(),

}