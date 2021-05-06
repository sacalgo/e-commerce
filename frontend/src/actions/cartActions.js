/* eslint-disable no-unused-vars */
import axios from "axios";
import { CART_ADD_ITEM } from "../constants/cartConstants";

//Thunk
//we will use  getstate for retrieving from reducers/stores
export const addToCart = (id, qty) => async (dispatch, getState) => {
  const { data } = await axios.get(`/api/products/${id}`);
  dispatch({
    type: CART_ADD_ITEM,
    payload: {
      product: data._id,
      name: data.name,
      image: data.image,
      price: data.price,
      countInStock: data.countInStock,
      qty,
    },
  });
  //we can only strore strings in localStorage, we can't store json objects
  //while retrievation we will use JSON.parse()
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

