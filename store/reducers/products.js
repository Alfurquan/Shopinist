import PRODUCTS from "./../../data/dummy-data";
import Product from "./../../models/products";

import {
  DELETE_PRODUCT,
  ADD_PRODUCT,
  UPDATE_PRODUCT,
  SET_PRODUCTS
} from "./../actions/products";

const intialState = {
  availableProducts: PRODUCTS,
  userProducts: PRODUCTS.filter(product => product.ownerId === "u1")
};

export default (state = intialState, action) => {
  switch (action.type) {
    case SET_PRODUCTS:
      return {
        availableProducts: action.products,
        userProducts: action.userProducts
      };
    case DELETE_PRODUCT:
      return {
        ...state,
        userProducts: state.userProducts.filter(
          product => product.id != action.pid
        ),
        availableProducts: state.availableProducts.filter(
          product => product.id != action.pid
        )
      };
    case ADD_PRODUCT:
      const newProduct = new Product(
        action.product.id,
        "u1",
        action.product.title,
        action.product.imageUrl,
        action.product.description,
        action.product.price
      );

      return {
        ...state,
        availableProducts: state.availableProducts.concat(newProduct),
        userProducts: state.userProducts.concat(newProduct)
      };

    case UPDATE_PRODUCT:
      const productIndex = state.userProducts.findIndex(
        prod => prod.id === action.pid
      );
      const updatedProduct = new Product(
        action.pid,
        state.userProducts[productIndex].ownerId,
        action.product.title,
        action.product.imageUrl,
        action.product.description,
        state.userProducts[productIndex].price
      );
      const updatedUserProducts = [...state.userProducts];
      updatedUserProducts[productIndex] = updatedProduct;
      const availableProductIndex = state.availableProducts.findIndex(
        prod => prod.id === action.pid
      );
      const updatedAvailableProducts = [...state.availableProducts];
      updatedAvailableProducts[availableProductIndex] = updatedProduct;
      return {
        ...state,
        availableProducts: updatedAvailableProducts,
        userProducts: updatedUserProducts
      };
  }
  return state;
};
