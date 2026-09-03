import React, { useContext, useState } from "react";
import { Input } from "@heroui/react";
import { Button } from "@heroui/react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserData } from "../../Context/UserData";

export default function Login() {
  let { Token, setToken } = useContext(UserData);

  let navigate = useNavigate();

  let [errMsg, seterrMsg] = useState(false);
  const [loading, setloading] = useState(null);
  let schema = z.object({
    email: z.email(),
    password: z
      .string()
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
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
        console.log(res.data.message);
        if (res.data.message == "signed in successfully") {
          console.log(res);
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

        console.log(error.response.data.message);
        seterrMsg(error.response.data.message);
      });
  }
  return (
    <div className="bg-gray-400 p-5 w-[75%] mx-auto my-5 rounded-2xl text-left">
      <h2>Login Now!</h2>
      {errMsg !== null ? (
        <h5 className="bg-red-500 rounded-2xl text-center">{errMsg}</h5>
      ) : (
        ""
      )}
      <form onSubmit={handleSubmit(submitForm)}>
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

        <Button type="submit" className="w-[95%]">
          {loading === true ? (
            <i className="fa fa-spin fa-spinner"></i>
          ) : (
            "Login"
          )}
        </Button>
      </form>
    </div>
  );
}
