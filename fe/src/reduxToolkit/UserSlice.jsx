import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: {
    // name: "",
    // phone: "",
    // avatar: null,
    // provider: "",
    // accountType: "",
    // status: false,
    // passwordResetCode: null,
    // createdAt: "",
    // updatedAt: "",
  },
};
// slice giúp mình tạo ra action và reducer
const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    login: (state, action) => {
      state.data = action.payload;
    },
    logout: (state, action) => {
      state.data = initialState.data;
    },
  },
});
//dung destructuring  lay ra actions va reducer trong counterSlice
const { actions, reducer } = userSlice;
export const { login, logout } = actions;
export default reducer;
