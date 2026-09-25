import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../Context/UserData";

export default function Navbar() {
  const navigate = useNavigate();

  let { Token, setToken, data } = useContext(UserData);
  // console.log(data);

  function logout() {
    localStorage.removeItem("userToken");
    setToken(null);
    // navigate("/login");
    navigate("/");
  }

  return (
    <>
      <div className=" sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto flex items-center min-h-16">
          {/* Left Side */}
          <div className="flex items-center gap-2">
            {Token !== null ? (
              <>
                <Link
                  to="home"
                  className="px-3 py-2 rounded-lg text-sm sm:text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition duration-200"
                >
                  <i className="fa-solid fa-house mr-2"></i>
                  Home
                </Link>

                <Link
                  to="profile"
                  className="px-3 py-2 rounded-lg text-sm sm:text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition duration-200"
                >
                  <i className="fa-regular fa-user mr-2"></i>
                  Profile
                </Link>
              </>
            ) : (
              <span className="text-xl sm:text-2xl font-bold text-gray-800">
                Social App
              </span>
            )}
          </div>

          {/* Right Side */}
          <div className="ml-auto flex items-center gap-3">
            {Token !== null ? (
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="cursor-pointer rounded-full p-1 hover:bg-gray-100 transition duration-200"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200">
                    <img
                      alt={data?.name || "User"}
                      src={data?.photo}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <ul
                  tabIndex="-1"
                  className="menu menu-sm dropdown-content bg-white border border-gray-200 rounded-xl z-50 mt-3 w-48 p-2 shadow-lg"
                >
                  <li>
                    <span
                      onClick={logout}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 cursor-pointer hover:bg-red-50 transition duration-200"
                    >
                      <i className="fa-solid fa-right-from-bracket"></i>
                      Logout
                    </span>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <Link
                  to="register"
                  className="px-3 py-2 rounded-lg text-lg font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition duration-200"
                >
                  Register
                </Link>

                <Link
                  to="/"
                  className="px-3 py-2 rounded-lg text-lg font-medium text-white bg-blue-500 hover:bg-blue-600 transition duration-200"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
