import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "./features/SearchSlice"
import cartReducer from "./features/CartSlice"
import orderReducer from "./features/OrderSlice"
import bookReducer from "./features/BookSlice"
import imageReducer from "./features/ImageSlice"
import genreReducer from "./features/GenreSlice"
import userReducer from "./features/UserSlice"
import authReducer from "./features/AuthSlice"

export const store = configureStore({
  reducer: {
    search: searchReducer,
    cart: cartReducer,
    order: orderReducer,
    book: bookReducer,
    image: imageReducer,
    genre: genreReducer,
    user: userReducer,
    auth: authReducer,
  },
});
