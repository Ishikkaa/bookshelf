import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../component/services/api";

export const getAllGenres = createAsyncThunk(
  "genre/getAllGenres",
  async () => {
    const response = await api.get("/genres/all");
    console.log("The getAllGenres response from slice 3: ", response.data.data);
    return response.data.data;
  }
);

const initialState = {
  genres: [],
  genre: null,
  errorMessage: null,
  successMessage: null,
}; 

const GenreSlice = createSlice({
    name: "book",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
    builder
      .addCase(getAllGenres.fulfilled, (state, action) => {
        state.genres = action.payload;
        state.errorMessage = null;
      })
    },
})


export default GenreSlice.reducer;