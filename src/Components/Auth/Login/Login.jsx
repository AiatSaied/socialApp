import React, { useContext, useState } from "react";
import { Input } from "@heroui/react";
import { Button } from "@heroui/react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserData } from "../../Context/UserData";
import { Helmet } from "react-helmet";

export default function Login() {
  let { Token, setToken } = useContext(UserData);

  let navigate = useNavigate();

  let [errMsg, seterrMsg] = useState("");
  const [loading, setloading] = useState(null);
  // let schema = z.object({
  //   email: z.email(),
  //   password: z
  //     .string()
  //     .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
  // });
  let schema = z.object({
    email: z.email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
  });
  // formState ===> errors
  let { register, handleSubmit, formState } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(schema),
  });

  function submitForm(values) {
    // console.log(values);
    // Start Loading
    setloading(true);

    axios
      .post(`https://route-posts.routemisr.com/users/signin`, values)
      .then((res) => {
        // console.log(res.data.message);
        if (res.data.message == "signed in successfully") {
          // console.log(res);
          localStorage.setItem("userToken", res.data.data.token);
          setToken(res.data.data.token);
          // Stop Loading
          setloading(false);

          navigate("/home");
        }
      })
      .catch((error) => {
        // Stop Loading
        setloading(false);

        // console.log(error.response.data.message);
        seterrMsg(error.response?.data?.message);
      });
  }

  return (
    <div className="min-h-screen bg-gray-400 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl bg-gray-300 p-6 sm:p-8 rounded-2xl shadow-lg">
        <Helmet>
          <title>Login</title>
        </Helmet>

        {/* <h2>Login Now!</h2> */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>

          <p className="text-gray-500 mt-2">
            Login to continue to your account.
          </p>
        </div>

        {errMsg && (
          <p className="bg-red-100 text-red-600 rounded-lg p-3 text-sm mb-4">
            {errMsg}
          </p>
        )}
        <form onSubmit={handleSubmit(submitForm)}>
          {/* Email Input */}
          <div>
            <Input
              {...register("email")}
              type="email"
              aria-label="Email"
              className="w-full my-3"
              placeholder="Enter your Email"
            />
            {formState.errors.email ? (
              <p className="text-red-600 mt-1">
                {formState.errors.email.message}
              </p>
            ) : (
              ""
            )}
          </div>

          {/* Password Input */}
          <div>
            <Input
              {...register("password")}
              type="password"
              aria-label="Password"
              className="w-full my-3"
              placeholder="Enter your Password"
            />
            {formState.errors.password ? (
              <p className="text-red-600">
                {formState.errors.password.message}
              </p>
            ) : (
              ""
            )}
          </div>

          <Button type="submit" className="w-full mt-3 text-lg">
            {loading === true ? (
              <i className="fa fa-spin fa-spinner"></i>
            ) : (
              "Login"
            )}
          </Button>

          <p className="text-center text-lg text-gray-500 mt-5">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-blue-600 font-medium hover:underline"
            >
              Register
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
