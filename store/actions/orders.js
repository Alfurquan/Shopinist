export const ADD_ORDER = "ADD_ORDER";
export const SET_ORDER = "SET_ORDER";
import { apiUrl } from "../../config/config.json";
import Order from "./../../models/order";

const orderUrl = apiUrl + "/api/orders";

export const fetchOrders = () => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    try {
      const response = await fetch(orderUrl, {
        method: "GET",
        headers: {
          "x-auth-token": token
        }
      });
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const resData = await response.json();
      // console.log("res", resData);

      let loadedOrders = [];
      resData.forEach(order => {
        loadedOrders.push(
          new Order(
            order._id,
            order.cartItems,
            order.totalAmount,
            new Date(order.date)
          )
        );
      });
      // console.log("loaded", loadedOrders);

      dispatch({
        type: SET_ORDER,
        orders: loadedOrders
      });
    } catch (err) {
      console.log("error", err);
    }
  };
};

export const addOrder = (cartItems, totalAmount) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(orderUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token
      },
      body: JSON.stringify({
        cartItems,
        totalAmount,
        date: new Date().toISOString()
      })
    });
    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    const resData = await response.json();
    // console.log("d", resData);

    dispatch({
      type: ADD_ORDER,
      orderData: {
        id: resData._id,
        items: cartItems,
        amount: totalAmount
      }
    });
  };
};
