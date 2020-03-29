import {gql} from "apollo-boost";
import { Query } from "react-apollo";

// types and values we want the client too have access to
export const typeDefs = gql`
  extend type Mutation {
    ToggleCartHidden: Boolean
  }
`;

// Read initial cart hidden value because we'll need to flip the value
// @client is a client directive to specify that query is coming from
// client side
const GET_CART_HIDDEN = gql`
  {
    cartHidden @client
  }
`;

// Lecture 231: Mutations on client
// _root object represents the the gql class schema
// _args gets passed into Mutations or query
// _context {cache} is the thing apollo has access to
// _info is the information about Mutation
export const resolvers = {
  Mutation: {
    toggleCartHidden: (_root, _args, {cache}) => {
      const { cartHidden} = cache.readQuery({
      query: GET_CART_HIDDEN,
      });

      cache.writeQuery({
        query: GET_CART_HIDDEN,
        data: {cartHidden: !cartHidden}
      });

      return !cartHidden
    }
  }
}
