import "./App.css";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Layouts from "./Components/Layouts/Layouts";
import Home from "./Components/Home/Home";
import Profile from "./Components/Profile/Profile";
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

let queryClient = new QueryClient();

function App() {
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
          path: "profile",
          element: (
            <ProtectedRoute>
              <Profile />
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

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      <UserDataProvider>
        <ToastContainer />
        <RouterProvider router={routing}></RouterProvider>
        {/* All Components */}
      </UserDataProvider>
    </QueryClientProvider>

    // <UserDataProvider>
    //   <CounterContextProvider>
    //     <div className="text-center">
    //       <RouterProvider router={routing}></RouterProvider>
    //       {/* All Components */}
    //     </div>
    //   </CounterContextProvider>
    // </UserDataProvider>
  );
}

export default App;
