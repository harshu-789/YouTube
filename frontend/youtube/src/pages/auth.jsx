// import {useState} from "react"
// import {useNavigate} from "react-router-dom"
// import {toast} from 'react-hot-toast'
// import store from "../store/userAuth.js"






// function Auth (){
//     const [isLoggedIn, setIsLoggedIn] = useState(true)
//     const [ formData,setFormData] = useState({
//         username: '',
//         email: '',
//         password: '',
//     })
//     const navigate = useNavigate();
//     const { login, register } = store();
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//           if (isLoggedIn) {
//             await login(formData.email, formData.password);
//           } else {
//             await register(formData.username, formData.email, formData.password);
//           }
//           toast.success(isLoggedIn ? 'Welcome back!' : 'Account created successfully!');
//           navigate('/');
//         } catch (error) {
//           toast.error(error.message || 'Something went wrong');
//         }
//       };
    
//       return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//           <div className="max-w-md w-full space-y-8">
//             <div>
//               <img
//                 className="mx-auto h-12 w-auto"
//                 src="https://www.youtube.com/s/desktop/7c155e84/img/favicon_144x144.png"
//                 alt="YouTube"
//               />
//               <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//                 {isLoggedIn ? 'Sign in to your account' : 'Create a new account'}
//               </h2>
//             </div>
//             <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//               {!isLoggedIn && (
//                 <div>
//                   <label htmlFor="username" className="sr-only">
//                     Username
//                   </label>
//                   <input
//                     id="username"
//                     name="username"
//                     type="text"
//                     required
//                     value={formData.username}
//                     onChange={(e) =>
//                       setFormData({ ...formData, username: e.target.value })
//                     }
//                     className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                     placeholder="Username"
//                   />
//                 </div>
//               )}
//               <div>
//                 <label htmlFor="email" className="sr-only">
//                   Email address
//                 </label>
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   required
//                   value={formData.email}
//                   onChange={(e) =>
//                     setFormData({ ...formData, email: e.target.value })
//                   }
//                   className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                   placeholder="Email address"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="password" className="sr-only">
//                   Password
//                 </label>
//                 <input
//                   id="password"
//                   name="password"
//                   type="password"
//                   required
//                   value={formData.password}
//                   onChange={(e) =>
//                     setFormData({ ...formData, password: e.target.value })
//                   }
//                   className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                   placeholder="Password"
//                 />
//               </div>
    
//               <div>
//                 <button
//                   type="submit"
//                   className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 >
//                   {isLoggedIn ? 'Sign in' : 'Sign up'}
//                 </button>
//               </div>
//             </form>
    
//             <div className="text-center">
//               <button
//                 onClick={() => setIsLoggedIn(!isLoggedIn)}
//                 className="text-sm text-blue-600 hover:text-blue-800"
//               >
//                 {isLoggedIn
//                   ? "Don't have an account? Sign up"
//                   : 'Already have an account? Sign in'}
//               </button>
//             </div>
//           </div>
//         </div>
//       );
//     }
    
//     export default Auth;








import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, register } from '../store/userSlice';
import { toast } from 'react-hot-toast';

export default function Auth() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLoginMode) {
        await dispatch(login({ email: formData.email, password: formData.password })).unwrap();
        toast.success('Logged in successfully!');
      } else {
        await dispatch(register({ username: formData.username, email: formData.email, password: formData.password })).unwrap();
        toast.success('Account created successfully!');
      }
      navigate('/');
    } catch (err) {
      toast.error(err || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow">
        <h2 className="text-center text-2xl font-bold">
          {isLoginMode ? 'Sign In to Your Account' : 'Create a New Account'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginMode && (
            <div>
              <label htmlFor="username" className="block text-sm font-medium">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
                className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoginMode ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <p className="text-center text-sm">
          {isLoginMode ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={() => setIsLoginMode((prev) => !prev)}
            className="font-medium text-blue-600 hover:underline"
          >
            {isLoginMode ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
}
