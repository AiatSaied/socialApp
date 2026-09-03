import React from "react";
// import React, { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "../PostCard/PostCard";
import { PulseLoader } from "react-spinners";
import { useQuery } from "@tanstack/react-query";
import CreatePost from "../CreatePost/CreatePost";

export default function Home() {
  // const [allposts, setallposts] = useState(null);
  // const [isLoading, setisLoading] = useState(true);
  // const [isError, setisError] = useState(false);
  // const [error, seterror] = useState(null);

  // TanStack Query ==> Method ==> (fetching data, Handle Error & Loading , catching Data, sharing Data)

  function getAllPosts() {
    // Start Loading
    return axios.get(`https://route-posts.routemisr.com/posts`, {
      // params: { sort: "createdAt" },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  let { data, error, isError, isLoading } = useQuery({
    queryKey: ["getPosts"],
    queryFn: getAllPosts,
    select: (res) => res?.data?.data.posts,
    // refetchInterval: 3000,
    // refetchIntervalInBackground: false,
    // staleTime: 3000,
    // retry: 3,
    // retryDelay: 3000,
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

  // function getAllPosts() {
  //   // Start Loading
  //   axios
  //     .get(`https://route-posts.routemisr.com/posts`, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("userToken")}`,
  //       },
  //     })
  //     .then((res) => {
  //       // Stop Loading
  //       setisLoading(false);
  //       console.log(res.data.data.posts); // All posts
  //       setallposts(res.data.data.posts);
  //     })
  //     .catch((error) => {
  //       // Stop Loading
  //       setisError(true);
  //       setisLoading(false);
  //       console.log(error.message);
  //       seterror(error.message);
  //     });
  // }

  // useEffect(() => {
  //   getAllPosts();
  // }, []);

  // if (isLoading === true) {
  //   return (
  //     <div className="h-screen flex justify-center items-center">
  //       <PulseLoader color="lightseagreen" />
  //     </div>
  //   );
  // }

  // if (isError === true) {
  //   return (
  //     <div className="h-screen flex justify-center items-center text-red-600">
  //       <h2>{error}</h2>
  //     </div>
  //   );
  // }

  // return (
  //   <>
  //     {allposts?.map((post) => {
  //       return <PostCard posts={post} key={post.id} />;
  //     })}
  //   </>
  // );

  return (
    <>
      {/* Create post box */}
      <CreatePost />

      {data?.map((post) => {
        return <PostCard posts={post} key={post.id} />;
      })}
    </>
  );
}
