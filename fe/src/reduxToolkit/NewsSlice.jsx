import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  AddNewsService,
  DeleteNewsService,
  GetNewsService,
  UpdateNewsService,
} from "../services/newsService";

// Action async gọi API để lấy danh sách nhà
export const fetchNews = createAsyncThunk("new/fetchNews", async ({ id }) => {
  const response = await GetNewsService(id);
  console.log(response, "response");
  return response.data.data;
});
export const addNews = createAsyncThunk("new/updateNews", async ({ data }) => {
  const response = await AddNewsService(data);
  console.log( response.data.message, "response");
  return response.data.message;
});
export const updateNews = createAsyncThunk(
  "new/addNews",
  async ({ data, idNews }) => {
    const response = await UpdateNewsService(data, idNews);
    console.log(response, "response");
    return response.data.message;
  }
);
export const deleteNews = createAsyncThunk("new/deleteNews", async ({ idNews }) => {
  const response = await DeleteNewsService(idNews);
  console.log(response, "response");
  return response.data.message;
});
const newSlice = createSlice({
  name: "news",
  initialState: {
    news: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.news = action.payload;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addNews.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addNews.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(addNews.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateNews.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateNews.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(updateNews.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteNews.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteNews.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(deleteNews.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default newSlice.reducer;
