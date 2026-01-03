import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {privateApi} from "../../component/services/api";

export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async ({ bookId, quantity }) => {
        const formData = new FormData();
        formData.append("bookId", bookId);
        formData.append("quantity", quantity);
        const response = await privateApi.post("/cartItems/item/add", formData);
        return response.data;
    },
)

export const getUserCart = createAsyncThunk(
  "cart/getUserCart",
  async (userId) => {
    const response = await privateApi.get(`/carts/user/${userId}/cart`);
    console.log("The user cart from the slice", response.data);
    return response.data;
  }
)

export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ cartId, bookId, newQuantity }) => {
    console.log("Updating quantity", cartId, bookId, newQuantity);
    await privateApi.put(
      `/cartItems/cart/${cartId}/item/${bookId}/update?quantity=${newQuantity}`
    );

    return { bookId, newQuantity };
  }
);

export const removeItemFromCart = createAsyncThunk(
  "cart/removeItemFromCart",
  async ({ cartId, bookId }) => {
    console.log("remove cart item from slice: " , cartId, bookId)
    await privateApi.delete(`/cartItems/cart/${cartId}/item/${bookId}/remove`);
    return bookId;
  }
);

const initialState = {
  items: [],
  cartId: null,
  totalAmount: 0,
  errorMessage: null,
  successMessage: null,
}; 

const CartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
      clearCart: (state) => {
        state.items = [];
        state.totalAmount = 0;
      },
    },
    extraReducers: (builder) => {
    builder
      .addCase(addToCart.fulfilled, (state, action) => { 
        const { bookId, quantity } = action.meta.arg;

        state.items.push({
            bookId,
            quantity,
        });

        state.successMessage = action.payload.message;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.errorMessage = action.error.message;
      })
      .addCase(getUserCart.fulfilled, (state, action) => {
        const data = action.payload.data;
        state.items = data.items;
        state.cartId = data.cartId;
        state.totalAmount = data.totalAmount;
        state.errorMessage = null;
      })
      .addCase(getUserCart.rejected, (state, action) => {
        state.errorMessage = action.error.message;
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        const { bookId, newQuantity } = action.payload;
        const item = state.items.find((item) => item.book.id === bookId);
        if (item) {
          item.quantity = newQuantity;
          item.totalPrice = item.book.price * newQuantity;
        }
        state.totalAmount = state.items.reduce(
          (total, item) => total + item.totalPrice,
          0
        );
      })
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        const bookId = action.payload;
        state.items = state.items.filter((item) => item.book.id !== bookId);
        state.totalAmount = state.items.reduce(
          (total, item) => total + item.totalPrice,
          0
        );
      })
    },
});


export default CartSlice.reducer;
export const selectCartCount = (state) =>
  state.cart.items?.reduce((total, item) => total + (item?.quantity || 0), 0);