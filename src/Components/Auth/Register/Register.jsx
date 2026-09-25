import React, { useState } from "react";
import { Input } from "@heroui/react";
import { Button } from "@heroui/react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function Register() {
  let navigate = useNavigate();

  // let [errMsg, seterrMsg] = useState(false);
  let [errMsg, seterrMsg] = useState("");
  const [loading, setloading] = useState(null);
  let schema = z
    .object({
      name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(30, "Name must not exceed 30 characters"),
      // username: z.string().regex(/^[a-zA-Z0-9_]{3,30}$/, "ex. Ahmed123"),
      username: z
        .string()
        .trim()
        .min(3, "Username must be at least 3 characters")
        .max(30, "Username must not exceed 30 characters")
        .regex(
          /^[a-zA-Z0-9_]+$/,
          "Username can only contain letters, numbers, and underscores",
        ),
      email: z.email(),
      dateOfBirth: z
        .string()
        .min(1, "Date of birth is required")
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Please enter a valid date")
        .refine((date) => {
          const userDate = new Date(date);
          const todayDate = new Date();

          todayDate.setHours(0, 0, 0, 0);

          return userDate < todayDate;
        }, "Date of birth must be in the past"),
      gender: z.enum(["male", "female"], {
        error: "Please select your gender",
      }),
      password: z
        .string()
        .regex(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[#?!@$%^&*-]).{8,}$/,
          "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character",
        ),
      rePassword: z.string(),
    })
    .refine(
      (obj) => {
        return obj.password == obj.rePassword;
      },
      {
        error: "password & rePassword doesn't match",
        path: ["rePassword"],
      },
    );
  // formState ===> errors
  let { register, handleSubmit, formState } = useForm({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: undefined,
    },
    resolver: zodResolver(schema),
  });

  // let {name, onChange, onBlur, ref} = register("");

  function submitForm(values) {
    // console.log(values);
    // Start Loading
    setloading(true);

    axios
      .post(`https://route-posts.routemisr.com/users/signup`, values)
      .then((res) => {
        // console.log(res.data.message);
        if (res.data.message == "account created") {
          // Stop Loading
          setloading(false);

          navigate("/login");
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
          <title>Register</title>
        </Helmet>

        {/* <h2 className="font-semibold text-xl">Register Now!</h2> */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Create your account
          </h1>

          <p className="text-gray-500 mt-2">
            Join the community and start connecting with others.
          </p>
        </div>
        {errMsg && (
          <p className="bg-red-100 text-red-600 rounded-lg p-3 text-sm mb-4">
            {errMsg}
          </p>
        )}

        <form onSubmit={handleSubmit(submitForm)}>
          {/* Name Input */}
          <div>
            <Input
              {...register("name")}
              // name="name"
              aria-label="Name"
              className="w-full my-3"
              placeholder="Enter your name"
            />
            {formState.errors.name ? (
              <p className="text-red-600">{formState.errors.name.message}</p>
            ) : (
              ""
            )}
          </div>
          {/* UserName Input */}
          <div>
            <Input
              {...register("username")}
              name="username"
              aria-label="username"
              className="w-full my-3"
              placeholder="Enter your UserName"
            />
            {formState.errors.username ? (
              <p className="text-red-600">
                {formState.errors.username.message}
              </p>
            ) : (
              ""
            )}
          </div>
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
              <p className="text-red-600">{formState.errors.email.message}</p>
            ) : (
              ""
            )}
          </div>
          {/* Date of Birth Input */}
          <div>
            <Input
              {...register("dateOfBirth")}
              type="date"
              name="dateOfBirth"
              aria-label="dateOfBirth"
              className="w-full my-3"
            />
            {formState.errors.dateOfBirth ? (
              <p className="text-red-600">
                {formState.errors.dateOfBirth.message}
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
          {/* rePassword Input */}
          <div>
            <Input
              {...register("rePassword")}
              type="password"
              aria-label="Confirm Password"
              className="w-full my-3"
              placeholder="Confirm your Password"
            />
            {formState.errors.rePassword ? (
              <p className="text-red-600">
                {formState.errors.rePassword.message}
              </p>
            ) : (
              ""
            )}
          </div>
          {/* Gender Input */}
          <div className="mb-4">
            <p className="text-lg font-medium text-gray-800 mb-1">Gender</p>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  {...register("gender")}
                  id="male"
                  type="radio"
                  value="male"
                  name="gender"
                  aria-label="gender"
                />
                <label htmlFor="male">Male</label>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  {...register("gender")}
                  id="female"
                  type="radio"
                  value="female"
                  name="gender"
                  aria-label="gender"
                />
                <label htmlFor="female">Female</label>
              </label>
            </div>
            {formState.errors.gender ? (
              <p className="text-red-600 text-sm mt-1">
                {formState.errors.gender.message}
              </p>
            ) : (
              ""
            )}
          </div>

          <Button type="submit" className="w-full mt-3 text-lg">
            {loading === true ? (
              <i className="fa fa-spin fa-spinner"></i>
            ) : (
              "Register"
            )}
          </Button>
          <p className="text-center text-lg text-gray-500 mt-5">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-blue-600 font-medium hover:underline"
            >
              Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
