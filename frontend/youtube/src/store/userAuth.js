// import { configureStore } from "@reduxjs/toolkit";
// import userReducer from './userSlice';  // Import the user slice reducer


// const store = configureStore({
//   reducer: {
//     user: userReducer,  // Register the user slice
   
//   },
// });

// export default store;



import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';

export default configureStore({
  reducer: { user: userReducer }
});