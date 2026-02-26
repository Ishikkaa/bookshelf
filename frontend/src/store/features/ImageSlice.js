import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../component/services/api";

export const uploadImages = createAsyncThunk(
  "image/uploadImages",
  async ({ bookId, files }) => {
    const formData = new FormData();
    if (Array.isArray(files)) {
      files.forEach((file) => {
        formData.append("files", file);
      });
    } else {
      formData.append("files", files);
    }

    formData.append("bookId", bookId);
    const response = await api.post("/images/upload", formData);
    return response.data;
  }
);

export const updateBookImage = createAsyncThunk(
  "image/updateBookImage",
  async ({ imageId, file }) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.put(`/images/image/${imageId}/update`, formData);
    return response.data;
  }
)

const initialState = {};

const ImageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {},
  extraReducers: (buider) => {},
});

export default ImageSlice.reducer;
