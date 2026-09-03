import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { createContext, useEffect, useState } from "react";

export let UserData = createContext();

export function UserDataProvider(props) {
  const [Token, setToken] = useState(localStorage.getItem("userToken"));

  useEffect(() => {
    if (localStorage.getItem("userToken")) {
      setToken(localStorage.getItem("userToken"));
    }
  }, []);

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
    select: (res) => res?.data?.data.user,
  });

  console.log(data);

  return (
    <UserData.Provider value={{ Token, setToken, data }}>
      {props.children}
    </UserData.Provider>
  );
}
