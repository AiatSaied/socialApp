import React, { useState } from "react";
import { Input } from "@heroui/react";
import { Button } from "@heroui/react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  let navigate = useNavigate();

  let [errMsg, seterrMsg] = useState(false);
  const [loading, setloading] = useState(null);
  let schema = z
    .object({
      name: z
        .string()
        .min(2, "!at Least 2 characters")
        .max(8, "!max characters is 8"),
      username: z.string().regex(/^[a-zA-Z0-9_]{3,30}$/, "ex. Ahmed123"),
      email: z.email(),
      dateOfBirth: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .refine((date) => {
          let userDate = new Date(date);
          let todayDate = new Date();
          todayDate.setHours(0, 0, 0, 0);
          return userDate < todayDate;
        }, "Invalid Date"),
      gender: z.enum(["male", "female", "Gender Required"]),
      password: z
        .string()
        .regex(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
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
      gender: "",
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
        console.log(res.data.message);
        if (res.data.message == "account created") {
          // Stop Loading
          setloading(false);

          navigate("/login");
        }
      })
      .catch((error) => {
        // Stop Loading
        setloading(false);

        console.log(error.response.data.message);
        seterrMsg(error.response.data.message);
      });
  }
  return (
    <div className="bg-gray-400 p-5 w-[75%] mx-auto my-5 rounded-2xl text-left">
      <h2>Register Now!</h2>
      {errMsg !== null ? (
        <h5 className="bg-red-500 rounded-2xl text-center">{errMsg}</h5>
      ) : (
        ""
      )}
      <form onSubmit={handleSubmit(submitForm)}>
        {/* Name Input */}
        <div>
          <Input
            {...register("name")}
            name="name"
            aria-label="Name"
            className="w-[95%] my-3"
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
            className="w-[95%] my-3"
            placeholder="Enter your UserName"
          />
          {formState.errors.username ? (
            <p className="text-red-600">{formState.errors.username.message}</p>
          ) : (
            ""
          )}
        </div>
        {/* Email Input */}
        <div>
          <Input
            {...register("email")}
            name="email"
            aria-label="email"
            className="w-[95%] my-3"
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
            className="w-[95%] my-3"
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
            name="password"
            aria-label="password"
            className="w-[95%] my-3"
            placeholder="Enter your Password"
          />
          {formState.errors.password ? (
            <p className="text-red-600">{formState.errors.password.message}</p>
          ) : (
            ""
          )}
        </div>
        {/* rePassword Input */}
        <div>
          <Input
            {...register("rePassword")}
            name="rePassword"
            aria-label="rePassword"
            className="w-[95%] my-3"
            placeholder="Enter your rePassword"
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
        <div>
          <input
            {...register("gender")}
            id="male"
            type="radio"
            value="male"
            name="gender"
            aria-label="gender"
            className="my-2 mx-2"
          />
          <label htmlFor="male">Male</label>
        </div>
        {/* Gender Input */}
        <div>
          <input
            {...register("gender")}
            id="female"
            type="radio"
            value="female"
            name="gender"
            aria-label="gender"
            className="my-2 mx-2"
          />
          <label htmlFor="female">Female</label>
        </div>
        {formState.errors.gender ? (
          <p className="text-red-600">{formState.errors.gender.message}</p>
        ) : (
          ""
        )}

        <Button type="submit" className="w-[95%]">
          {loading === true ? (
            <i className="fa fa-spin fa-spinner"></i>
          ) : (
            "Register"
          )}
        </Button>
      </form>
    </div>
  );
}
