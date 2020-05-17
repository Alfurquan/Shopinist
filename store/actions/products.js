import Product from "./../../models/products";
import { apiUrl } from "../../config/config.json";
import getCurrentUser from "./../../services/UserService";
export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const ADD_PRODUCT = "ADD_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const SET_PRODUCTS = "SET_PRODUCTS";

const productUrl = apiUrl + "/api/products";

export const fetchProducts = () => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const user = getCurrentUser(token);
    try {
      const response = await fetch(productUrl);

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const resData = await response.json();
      // console.log(resData);

      const loadedProducts = [];
      resData.forEach(product => {
        loadedProducts.push(
          new Product(
            product._id,
            product.user._id,
            product.title,
            product.imageUrl,
            product.description,
            +product.price
          )
        );
      });
      // console.log("loaded", loadedProducts);
      dispatch({
        type: SET_PRODUCTS,
        products: loadedProducts,
        userProducts: loadedProducts.filter(
          product => product.ownerId === user._id
        )
      });
    } catch (err) {
      throw err;
    }
  };
};

export const deleteProduct = productId => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(productUrl + "/" + productId, {
      method: "DELETE",
      headers: {
        "x-auth-token": token
      }
    });
    if (!response.ok) {
      throw new Error("Something went wrong!");
    }
    return dispatch({
      type: DELETE_PRODUCT,
      pid: productId
    });
  };
};

export const addProduct = (title, imageUrl, price, description) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(productUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token
      },
      body: JSON.stringify({
        title,
        description,
        imageUrl,
        price
      })
    });

    const resData = await response.json();
    console.log(resData);

    dispatch({
      type: ADD_PRODUCT,
      product: {
        id: resData._id,
        title,
        imageUrl,
        price,
        description
      }
    });
  };
};

export const updateProduct = (id, title, imageUrl, description) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;

    const response = await fetch(productUrl + "/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token
      },
      body: JSON.stringify({
        title,
        imageUrl,
        description
      })
    });

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }
    // console.log("response", await response.json());

    return dispatch({
      type: UPDATE_PRODUCT,
      pid: id,
      product: {
        title,
        imageUrl,
        description
      }
    });
  };
};
