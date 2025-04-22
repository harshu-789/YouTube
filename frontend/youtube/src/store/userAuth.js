import { configureStore } from "@reduxjs/toolkit";
import userReducer from './userSlice';  // Import the user slice reducer
// import hamburgerMenuReducer from './hamburgerMenuSlice';  // Import the hamburger menu slice reducer

const store = configureStore({
  reducer: {
    user: userReducer,  // Register the user slice
    // hamburgerMenu: hamburgerMenuReducer  // Register the hamburger menu slice
  },
});

export default store;