import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api , privateApi} from "../../component/services/api";

export const getAllBooks = createAsyncThunk(
  "book/getAllBooks",
  async () => {
    const response = await api.get("/books/all");
    return response.data.data;
  }
);

export const getBookById = createAsyncThunk(
  "book/getBookById",
  async (bookId) => {
    const response = await api.get(`/books/book/${bookId}/book`);
    return response.data.data;
  }
);

export const addNewBook = createAsyncThunk(
  "book/addNewBook",
  async (book) => {
    
    const response = await privateApi.post("/books/add", book);
    console.log("The add book response from slice: ", response.data.data);
    return response.data.data;
  }
);

export const updateBook = createAsyncThunk(
  "book/updateBook",
  async ({ bookId, updatedBook }) => {
   const response = await privateApi.put(
      `/books/book/${bookId}/update`,
      updatedBook);
    return response;
  }
);

export const deleteBook = createAsyncThunk(
  "book/deleteBook",
  async (bookId) => {
    const response = await privateApi.delete(`/books/book/${bookId}/delete`);
    return response.data;
  }
);

const initialState = {
  books: [],
  book: null,
  errorMessage: null,
  successMessage: null,
}; 

const BookSlice = createSlice({
    name: "book",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
    builder
      .addCase(getAllBooks.fulfilled, (state, action) => {
        state.books = action.payload;
        state.errorMessage = null;
      })
      .addCase(getBookById.fulfilled, (state, action) => {
        state.book = action.payload;
      })
      .addCase(addNewBook.fulfilled, (state, action) => {
        state.books.push(action.payload);
        state.errorMessage = null;
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        state.book = action.payload.data;
        state.errorMessage = null;
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.books = state.books.filter(
          (book) => book.id !== action.payload.data
        );
      })
    },
})


export default BookSlice.reducer;