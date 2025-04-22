import { useState } from "react";
import {Link , useNavigate } from "react-router-dom";
import store from "../store/userAuth";
import { Bars3Icon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';





function Header ({onMenuClick}){
    const [searchQuery,setSearchQuery] = useState('')
    const navigate = useNavigate()
    const {user,logout} = store()

    const handleSubmit = (e)=>{
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/?search=${searchQuery}`);
          }
    } 

    return(
        <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <Link to="/" className="flex items-center gap-1">
            <img
              src="https://www.youtube.com/s/desktop/7c155e84/img/favicon_144x144.png"
              alt="YouTube"
              className="h-8"
            />
            <span className="text-xl font-semibold">YouTube</span>
          </Link>
        </div>

        <form
          onSubmit={handleSearch}
          className="flex items-center flex-1 max-w-2xl mx-4"
        >
          <div className="flex flex-1">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-full hover:bg-gray-200"
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>
          </div>
        </form>

        <div>
          {user ? (
            <div className="flex items-center gap-4">
              <span>{user.username}</span>
              <button
                onClick={logout}
                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
    )
}
export default Header;