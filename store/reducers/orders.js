import { ADD_ORDER, SET_ORDER } from "../actions/orders";
import Order from "./../../models/order";

const initialState = {
  orders: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_ORDER:
      const newOrder = new Order(
        action.orderData.id,
        action.orderData.items,
        action.orderData.amount,
        new Date()
      );
      return {
        ...state,
        orders: state.orders.concat(newOrder)
      };

    case SET_ORDER:
      return {
        orders: action.orders
      };
  }
  return state;
};
