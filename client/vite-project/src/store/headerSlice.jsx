import { createSlice } from "@reduxjs/toolkit";

const headerSlice = createSlice({
  name: "header",
  initialState: {
    show: false,
  },
  reducers: {
    toggleMenu: (state) => {
      state.show = !state.show;
    },
  },
});

export const { toggleMenu } = headerSlice.actions;

export default headerSlice.reducer;
