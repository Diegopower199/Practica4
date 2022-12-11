import { gql } from "graphql_tag";

export const typeDefs = gql`
type Vendedor {
  id: String!
  name: String!
  coches: [Coche!]!
}

type Coche {
  id: String!
  marca: String!
  matricula: String!
  asientos: Int!
  vendedor: String
  precio: Int!
}

type Concesionario {
  id: String!
  localidad: String!
  vendedores: [Vendedor!]!
}

type Query {
  getVendedorPorId(id: String!): Vendedor!
  getVendedoresNombres(name: String!): [Vendedor!]!
  getCochePorId(id: String!): Coche!
  getCochePorRangoPrecio(precioMin: Int!, precioMax: Int!): [Coche!]!
  getConcesionarioPorId (id: String!): Concesionario!
  getConcesionarioPorLocalidad(localidad: String!): [Concesionario!]!
}

type Mutation {
  crearVendedor(name: String!): Vendedor!
  crearCoche(marca: String!, matricula: String!, asientos: Int!, precio: Int!): Coche!
  crearConcesionario(localidad: String!): Concesionario
  anadirCocheAUnVendedor(idCoche: String!, idVendedor: String!): Vendedor!
  anadirVendedorAUnConcesionario(idVendedor: String!, idConcesionario: String!): Concesionario! 
}
`;
