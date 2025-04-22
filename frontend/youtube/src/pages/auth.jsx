import {useState} from "react"
import {useNavigate} from "react-router-dom"
import {toast} from 'react-hot-toast'
import store from "../store/userAuth.js"






function Auth (){
    const [isLoggedIn, setIsLoggedIn] = useState(true)
    const [ formData,setFormData] = useState({
        username: '',
        email: '',
        password: '',
    })
    const navigate = useNavigate();
    const { login, register } = store();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          if (isLoggedIn) {
            await login(formData.email, formData.password);
          } else {
            await register(formData.username, formData.email, formData.password);
          }
          toast.success(isLoggedIn ? 'Welcome back!' : 'Account created successfully!');
          navigate('/');
        } catch (error) {
          toast.error(error.message || 'Something went wrong');
        }
      };
    
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div>
              <img
                className="mx-auto h-12 w-auto"
                src="https://www.youtube.com/s/desktop/7c155e84/img/favicon_144x144.png"
                alt="YouTube"
              />
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                {isLoggedIn ? 'Sign in to your account' : 'Create a new account'}
              </h2>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              {!isLoggedIn && (
                <div>
                  <label htmlFor="username" className="sr-only">
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Username"
                  />
                </div>
              )}
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
    
              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {isLoggedIn ? 'Sign in' : 'Sign up'}
                </button>
              </div>
            </form>
    
            <div className="text-center">
              <button
                onClick={() => setIsLoggedIn(!isLoggedIn)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {isLoggedIn
                  ? "Don't have an account? Sign up"
                  : 'Already have an account? Sign in'}
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    export default Auth;