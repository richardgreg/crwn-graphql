import {gql} from "apollo-boost";

import {addItemToCart} from "./cart.utils";


// types and values we want the client to have access to
export const typeDefs = gql`
  extend type Item {
    quantity: Int
  }

  extend type Mutation {
    ToggleCartHidden: Boolean!
    AddItemToCart(item: Item!): [item]!
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

const GET_CART_ITEMS = gql`
  {
    cartItems @client
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

      return !cartHidden;
    },

    addItemToCart: (_root, {item}, {cache}) => {
      // Destructure state of cart items from client
      const {cartItems} =cache.readQuery({
        query: GET_CART_ITEMS
      });

      const newCartItems = addItemToCart(cartItems, item);

      cache.writeQuery({
        query: GET_CART_ITEMS,
        data: {cartItems: newCartItems}
      });

      return newCartItems;
    }
  }
}
