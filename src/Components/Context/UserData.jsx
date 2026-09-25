import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { PulseLoader } from "react-spinners";

export let UserData = createContext();

export function UserDataProvider(props) {
  const [Token, setToken] = useState(localStorage.getItem("userToken"));

  useEffect(() => {
    if (localStorage.getItem("userToken")) {
      setToken(localStorage.getItem("userToken"));
    }
  }, []);
  // console.log(localStorage.getItem("userToken"));
  function getUserData() {
    return axios.get(`https://route-posts.routemisr.com/users/profile-data`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  let { data, error, isError, isLoading } = useQuery({
    queryKey: ["userData"],
    queryFn: getUserData,
    enabled: !!Token,
    select: (res) => res?.data?.data.user,
  });

  // console.log(data);

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <PulseLoader color="lightseagreen" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-screen flex justify-center items-center text-red-600 font-semibold">
        <h2>{error.message}</h2>
      </div>
    );
  }

  return (
    <UserData.Provider value={{ Token, setToken, data }}>
      {props.children}
    </UserData.Provider>
  );
}
