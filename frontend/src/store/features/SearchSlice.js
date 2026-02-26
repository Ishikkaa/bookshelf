import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchQuery: "",
};

const SearchSlice = createSlice({
  name: "search",

  initialState,

  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    }
  },
});

export const { setSearchQuery} = SearchSlice.actions;

export default SearchSlice.reducer;
