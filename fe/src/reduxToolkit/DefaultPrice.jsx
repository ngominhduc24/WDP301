import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  AddDefaultPriceService,
  GetAllDefaultPriceService,
  GetOneDefaultPriceService,
} from "../services/defaultPrice";

export const fetchDefaultPrice = createAsyncThunk(
  "defaultPrice/fetchDefaultPrice",
  async () => {
    const response = await GetAllDefaultPriceService();
    return response.data.data;
  }
);
export const addDefaultPrice = createAsyncThunk(
  "defaultPrice/addDefaultPrice",
  async ({ data }) => {
    const response = await AddDefaultPriceService(data);
    console.log(response, "response");
  }
);
const defaultPrice = createSlice({
  name: "defaultPrice",
  initialState: {
    defaultPrices: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDefaultPrice.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDefaultPrice.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.comments = action.payload;
      })
      .addCase(fetchDefaultPrice.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addDefaultPrice.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addDefaultPrice.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(addDefaultPrice.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default defaultPrice.reducer;
