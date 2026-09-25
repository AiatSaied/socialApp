import React, { useContext, useState } from "react";
import { Input, Button } from "@heroui/react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import axios from "axios";

import { useNavigate } from "react-router-dom";
import { UserData } from "../../Context/UserData";
import { Helmet } from "react-helmet";

export default function ChangePassword() {
  let { Token } = useContext(UserData);
  // let { Token, setToken } = useContext(UserData);

  let navigate = useNavigate();

  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  let schema = z
    .object({
      password: z.string().min(1, "Current password is required"),

      newPassword: z
        .string()
        .regex(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[#?!@$%^&*-]).{8,}$/,
          "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character",
        ),

      rePassword: z.string().min(1, "Please confirm your new password"),
    })
    .refine((data) => data.newPassword === data.rePassword, {
      message: "New password and confirmation password do not match",
      // error: "password & rePassword doesn't match",
      path: ["rePassword"],
    });

  let {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      password: "",
      newPassword: "",
      rePassword: "",
    },
    resolver: zodResolver(schema),
  });

  function submitForm(values) {
    // console.log(values);
    setErrMsg("");
    setSuccessMsg("");

    const data = {
      password: values.password,
      newPassword: values.newPassword,
    };

    axios
      .patch("https://route-posts.routemisr.com/users/change-password", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      })
      .then((res) => {
        console.log(res.data);

        setSuccessMsg(res.data.message || "Password changed successfully");

        setTimeout(() => {
          navigate("/profile");
        }, 1500);
      })
      .catch((error) => {
        console.log(error.response?.data?.message);

        setErrMsg(
          error.response?.data?.message ||
            "Something went wrong. Please try again.",
        );
      });
  }

  return (
    <div className="min-h-screen bg-gray-400 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl bg-gray-300 p-6 sm:p-8 rounded-2xl shadow-lg">
        <Helmet>
          <title>Change Password</title>
        </Helmet>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Change Password</h1>

          <p className="text-gray-500 mt-2">
            Update your password to keep your account secure.
          </p>
        </div>

        {errMsg && (
          <p className="bg-red-100 text-red-600 rounded-lg p-3 text-sm mb-4">
            {errMsg}
          </p>
        )}

        {successMsg && (
          <p className="bg-green-100 text-green-600 rounded-lg p-3 text-sm mb-4">
            {successMsg}
          </p>
        )}

        <form onSubmit={handleSubmit(submitForm)}>
          {/* Current Password */}
          <div className="mb-4">
            <Input
              {...register("password")}
              type="password"
              label="Current Password"
              placeholder="Enter your current password"
              className="w-full"
            />

            {errors.password && (
              <p className="text-red-600 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="mb-4">
            <Input
              {...register("newPassword")}
              type="password"
              label="New Password"
              placeholder="Enter your new password"
              className="w-full"
            />

            {errors.newPassword && (
              <p className="text-red-600 text-sm mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm New Password */}
          <div className="mb-5">
            <Input
              {...register("rePassword")}
              type="password"
              label="Confirm New Password"
              placeholder="Confirm your new password"
              className="w-full"
            />

            {errors.rePassword && (
              <p className="text-red-600 text-sm mt-1">
                {errors.rePassword.message}
              </p>
            )}
          </div>

          <Button type="submit" isDisabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <i className="fa fa-spin fa-spinner"></i>
            ) : (
              "Change Password"
            )}
          </Button>

          <Button
            type="button"
            variant="light"
            className="w-full mt-2"
            onClick={() => navigate("/profile")}
          >
            Cancel
          </Button>
        </form>
      </div>
    </div>
  );
}
