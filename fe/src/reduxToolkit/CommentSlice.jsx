import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AddCommentService, GetCommentService } from "../services/newsService";

export const fetchCommentNews = createAsyncThunk(
  "comment/commentNews",
  async ({ idNews }) => {
    const response = await GetCommentService(idNews);
    console.log(response, "response");
    return response.data.data;
  }
);
export const addCommentNews = createAsyncThunk(
  "comment/addcommentNews",
  async ({ idNews,comment }) => {
    const response = await AddCommentService(idNews,comment);
    console.log(response, "response");
  }
);
const commentSlice = createSlice({
  name: "comments",
  initialState: {
    comments: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommentNews.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCommentNews.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.comments = action.payload;
      })
      .addCase(fetchCommentNews.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addCommentNews.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addCommentNews.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(addCommentNews.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default commentSlice.reducer;
