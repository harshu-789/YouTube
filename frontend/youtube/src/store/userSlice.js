
// // import { createSlice } from "@reduxjs/toolkit";

// // // Initial state with localStorage fallback
// // const userState = JSON.parse(localStorage.getItem("userState")) || {
// //   user: null,
// //   isLoggedIn: false,
// // };

// // const user = createSlice({
// //   name: "user",
// //   initialState: userState,
// //   reducers: {
// //     isLoggedIn: (state, action) => {
// //       state.user = action.payload;
// //       state.isLoggedIn = true;
// //       localStorage.setItem("userState", JSON.stringify(state));
// //     },
// //     isLoggedOut: (state) => {
// //       state.user = null;
// //       state.isLoggedIn = false;
// //       localStorage.removeItem("userState");
// //     },
// //     isUser: (state, action) => {
// //       // This will update the user data in the Redux store when polling returns new data
// //       state.user = action.payload;
// //     },
// //   },
// // });

// // export const { isLoggedIn, isLoggedOut, isUser } = user.actions;

// // export default user.reducer;



// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from '../lib/axios';

// export const login = createAsyncThunk(
//   'user/login',
//   async ({ email, password }, { rejectWithValue }) => {
//     try {
//       const response = await axios.post('/auth/login', { email, password });
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || err.message);
//     }
//   }
// );

// export const register = createAsyncThunk(
//   'user/register',
//   async ({ username, email, password }, { rejectWithValue }) => {
//     try {
//       const response = await axios.post('/auth/register', { username, email, password });
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || err.message);
//     }
//   }
// );

// const userSlice = createSlice({
//   name: 'user',
//   initialState: { user: null, status: 'idle', error: null },
//   reducers: {
//     logout(state) {
//       state.user = null;
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(login.fulfilled, (state, action) => {
//         state.user = action.payload;
//         state.error = null;
//       })
//       .addCase(login.rejected, (state, action) => {
//         state.error = action.payload;
//       })
//       .addCase(register.fulfilled, (state, action) => {
//         state.user = action.payload;
//         state.error = null;
//       })
//       .addCase(register.rejected, (state, action) => {
//         state.error = action.payload;
//       });
//   }
// });

// export const { logout } = userSlice.actions;
// export default userSlice.reducer;



// src/store/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../lib/axios'

// Async thunks for login/register
export const login = createAsyncThunk(
  'user/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await axios.post('/auth/login', { email, password })
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message)
    }
  }
)

export const register = createAsyncThunk(
  'user/register',
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const res = await axios.post('/user/registerUser', { username, email, password })
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message)
    }
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState: { user: null, status: 'idle', error: null },
  reducers: {
    logout(state) {
      state.user = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload
        state.error = null
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload
        state.error = null
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.payload
      })
  }
})

export const { logout } = userSlice.actions
export default userSlice.reducer