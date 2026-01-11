import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {privateApi} from "../../component/services/api";

export const placeOrder = createAsyncThunk(
  "order/placeOrder",
  async (userId) => {
    const response = await privateApi.post(`/orders/user/${userId}/place-order`);
    console.log("The response from the order slice : ", response.data);
    return response.data;
  }
);

export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async (userId) => {
    const response = await privateApi.get(`/orders/user/${userId}/order`)
    console.log("The user orders from the slice1 : ", response);
    console.log("The user orders from the slice2 : ", response.data);
    console.log("The user orders from the slice3 : ", response.data.data);
    return response.data.data;
  }
);

export const createPaymentIntent = createAsyncThunk(
  "payments/createPaymentIntent",
  async ({ userId, amount, currency }) => {
    console.log("createPaymentIntent from the slice :", {userId, amount, currency})
    const response = await privateApi.post("/orders/create-payment-intent", {
      userId,
      amount,
      currency,
    });
    return response.data;
  }
);

export const confirmPayment = createAsyncThunk(
  "payment/confirmPayment",
  async (clientSecret) => {
    try {
      const response = await privateApi.post(
        "/orders/confirm-payment",
        { clientSecret }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Payment confirmation failed"
      );
    }
  }
);

const initialState = {
  orderItems: [],
  loading: false,
  errorMessage: null,
  successMessage: null,
};

const OrderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.orderItems = (action.payload.order);
        state.loading = false;
        state.successMessage = action.payload.message;
      })
        .addCase(placeOrder.rejected, (state, action) => {
        state.errorMessage = action.error.message;
        state.loading = false;
      })        
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.orderItems = action.payload;
        state.loading = false;
      })
      .addCase(createPaymentIntent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.loading = false;
        state.clientSecret = action.payload.clientSecret;
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(confirmPayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(confirmPayment.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(confirmPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export default OrderSlice.reducer;
