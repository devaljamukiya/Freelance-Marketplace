import { configureStore, createSlice } from "@reduxjs/toolkit";
import authReducer from "./slices/authslice"

// const uiSlice = createSlice({
//   name: "ui",
//   initialState: {
//     sidebarShow: true,
//     theme: "light",
//   },
//   reducers: {
//     set: (state, action) => {
//       Object.assign(state, action.payload);
//     },
//   },
// });

// export const { set } = uiSlice.actions;

// --- Combined Store ---
export const store = configureStore({
  reducer: {
    auth: authReducer,
    // ui: uiSlice.reducer, 
  },
});

export default store;
