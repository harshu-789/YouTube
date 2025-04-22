
import { createSlice } from "@reduxjs/toolkit";

// Initial state with localStorage fallback
const userState = JSON.parse(localStorage.getItem("userState")) || {
  user: null,
  isLoggedIn: false,
};

const user = createSlice({
  name: "user",
  initialState: userState,
  reducers: {
    isLoggedIn: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
      localStorage.setItem("userState", JSON.stringify(state));
    },
    isLoggedOut: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      localStorage.removeItem("userState");
    },
    isUser: (state, action) => {
      // This will update the user data in the Redux store when polling returns new data
      state.user = action.payload;
    },
  },
});

export const { isLoggedIn, isLoggedOut, isUser } = user.actions;

export default user.reducer;
