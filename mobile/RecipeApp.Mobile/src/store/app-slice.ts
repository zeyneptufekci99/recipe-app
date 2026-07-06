import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
  name: "app",
  initialState: {
    isReady: true,
  },
  reducers: {},
});

export default appSlice.reducer;
