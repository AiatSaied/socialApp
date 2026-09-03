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
      <div className="navbar shadow-sm px-16 bg-gray-200">
        <div className="flex-1">
          {Token !== null ? (
            <>
              <Link to="home" className="btn btn-ghost text-xl text-black">
                Home
              </Link>
              <Link to="profile" className="btn btn-ghost text-xl text-black">
                Profile
              </Link>
            </>
          ) : (
            <>
              <span className="text-2xl">Social App</span>
            </>
          )}
        </div>
        <div className="flex gap-2">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img alt="Tailwind CSS Navbar component" src={data?.photo} />
              </div>
            </div>
            <ul
              tabIndex="-1"
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                {Token !== null ? (
                  <>
                    <span onClick={() => logout()} className="text-2xl">
                      Logout
                    </span>
                    {/* <Link to="login" className="text-2xl">
                      Logout
                    </Link> */}
                  </>
                ) : (
                  <>
                    <Link to="register" className="text-2xl">
                      Register
                    </Link>
                    <Link to="/" className="text-2xl">
                      {/* to="login" */}
                      Login
                    </Link>
                  </>
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
