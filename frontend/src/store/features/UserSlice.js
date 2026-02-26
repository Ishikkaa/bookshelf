import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../component/services/api";
import axios from "axios";

export const getUserById = createAsyncThunk(
  "user/getUserById",
  async (userId) => {
    const response = await api.get(`/users/user/${userId}/user`);
    console.log("The user from the slice : ", response.data);
    return response.data;
  }
);

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post("/users/add", payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Registration failed");
    }
  }
);
export const addAddress = createAsyncThunk(
  "user/addAddress",
  async ({ address, userId }) => {
    const response = await api.post(`/addresses/${userId}/new`, [address]);
    return response.data;
  }
);

// Fetch User Addresses Thunk
export const fetchAddresses = createAsyncThunk(
  "user/fetchAddresses",
  async (userId) => {
    const response = await api.get(`/addresses/${userId}/address`);
    return response.data;
  }
);

// Update Address Thunk
export const updateAddress = createAsyncThunk(
  "user/updateAddress",
  async ({ id, address }) => {
    const response = await api.put(`/addresses/${id}/update`, address);
    return response.data;
  }
);

// Delete Address Thunk
export const deleteAddress = createAsyncThunk(
  "user/deleteAddress",
  async ({ id }) => {
    const response = await api.delete(`/addresses/${id}/delete`);
    return response.data;
  }
);

const initialState = {
  user: null,
  errorMessage: null,
  successMessage: null,
};

const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    setUserAddresses(state, action) {
      state.user.addressList = action.payload;
    }
  },
  extraReducers: (builder) => {
  builder
    .addCase(getUserById.fulfilled, (state, action) => {
      state.user = action.payload.data;
      state.successMessage = null;
      state.errorMessage = null;
    })
    .addCase(getUserById.rejected, (state, action) => {
      state.errorMessage =
        action.payload || action.error.message || "Something went wrong";
    })
    .addCase(addAddress.fulfilled, (state, action) => {
      state.successMessage = action.payload.message;
    })
    .addCase(addAddress.rejected, (state, action) => {
      state.errorMessage =
        action.payload || action.error.message || "Failed to add address";
    })
    .addCase(updateAddress.fulfilled, (state, action) => {
      const updatedAddress = action.payload.data;
      const index = state.user.addressList.findIndex(
        (addr) => addr.id === updatedAddress.id
      );

      if (index !== -1) {
        state.user.addressList[index] = updatedAddress;
      }

      state.successMessage = "Address updated successfully";
    })
    .addCase(updateAddress.rejected, (state, action) => {
      state.errorMessage =
        action.payload || action.error.message || "Failed to update address";
    })
    .addCase(deleteAddress.fulfilled, (state, action) => {
      const deletedId = action.meta.arg.id;

      state.user.addressList = state.user.addressList.filter(
        (addr) => addr.id !== deletedId
      );

      state.successMessage = "Address deleted successfully";
    })
    .addCase(deleteAddress.rejected, (state, action) => {
      state.errorMessage =
        action.payload || action.error.message || "Failed to delete address";
    });
  }
});

export default UserSlice.reducer;
