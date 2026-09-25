import "./App.css";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Layouts from "./Components/Layouts/Layouts";
import Home from "./Components/Home/Home";
import Profile from "./Components/Profile/Profile";

import ChangePassword from "./Components/Auth/ChangePassword/ChangePassword";

import Login from "./Components/Auth/Login/Login";
import Register from "./Components/Auth/Register/Register";

import NotFound from "./Components/NotFound/NotFound";

import { CounterContextProvider } from "./Components/Context/counterContext";
import { UserDataProvider } from "./Components/Context/UserData";

import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import PostDetails from "./Components/PostDetails/PostDetails";
import AuthProtect from "./Components/AuthProtect/AuthProtect";

import { ToastContainer } from "react-toastify";
import { useNetworkState } from "react-use";

let queryClient = new QueryClient();

function App() {
  let { online } = useNetworkState();

  let routing = createBrowserRouter([
    {
      path: "",
      element: <Layouts />,
      children: [
        {
          path: "home",
          element: (
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          ),
        },
        {
          path: "home/postdetails/:id",
          element: (
            <ProtectedRoute>
              <PostDetails />
            </ProtectedRoute>
          ),
        },
        {
          path: "profile/postdetails/:id",
          element: (
            <ProtectedRoute>
              <PostDetails />
            </ProtectedRoute>
          ),
        },
        {
          path: "profile",
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          ),
        },
        {
          path: "change-password",
          element: (
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          ),
        },
        {
          index: true, //path: "login",
          element: (
            // <Login />
            <AuthProtect>
              <Login />
            </AuthProtect>
          ),
        },
        {
          path: "login",
          element: <Navigate to="/" replace />,
        },
        {
          path: "register",
          element: (
            // <Register />
            <AuthProtect>
              <Register />
            </AuthProtect>
          ),
        },
        { path: "*", element: <NotFound /> },
      ],
    },
  ]);

  if (!online) {
    return (
      <div className="h-screen bg-red-600 text-3xl text-center flex justify-center items-center font-medium">
        <h2>Network Error</h2>
      </div>
    );
  }

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools />
        <UserDataProvider>
          <ToastContainer />
          <RouterProvider router={routing}></RouterProvider>
          {/* All Components */}
        </UserDataProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
