import React, { useContext } from "react";
import { UserData } from "../Context/UserData";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import PostCard from "../PostCard/PostCard";

export default function Profile() {
  let { data } = useContext(UserData);

  function getUserPosts() {
    return axios.get(
      `https://route-posts.routemisr.com/users/${data.id}/posts`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  let { data: userPosts, error } = useQuery({
    queryKey: ["userPosts"],
    queryFn: getUserPosts,
    select: (res) => res?.data?.data?.posts,
  });

  console.log(userPosts); //[ {}, {}]

  return (
    <>
      <div className="relative w-full m-auto my-5 max-w-md bg-white shadow-xl rounded-lg overflow-hidden animate-fade-in">
        {/* Cover Image Section */}
        <div
          className="h-40 bg-cover bg-center cover-gradient-fallback"
          style={{
            backgroundImage: `url(${data?.photo})`,
          }}
        >
          {/* You can replace the URL with your desired cover image */}
        </div>
        {/* Profile Picture and Details Section */}
        <div className="relative px-6 -mt-20">
          {/* Profile Picture */}
          <img
            className="w-32 h-32 rounded-full border-4 border-white mx-auto shadow-md object-cover"
            src={data?.photo}
            alt="Profile Picture"
          />
          {/* You can replace the URL with your desired profile picture */}
          {/* User Info */}
          <div className="text-center mt-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              {data?.name}
            </h2>
            <p className="text-gray-600">{data?.dateOfBirth}</p>
            <p className="text-sm text-gray-500 mt-2">
              Passionate about creating intuitive and beautiful web experiences.
            </p>
          </div>
          {/* Optional: Social Links or Stats */}
          <div className="flex justify-center mt-6 space-x-4 border-t pt-6 border-gray-100">
            <div className="text-center">
              <p className="font-bold text-lg text-gray-800">1.2K</p>
              <p className="text-gray-500 text-sm">Followers</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-lg text-gray-800">250</p>
              <p className="text-gray-500 text-sm">Following</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-lg text-gray-800">50</p>
              <p className="text-gray-500 text-sm">Projects</p>
            </div>
          </div>
          {/* Call to Action Button (Optional) */}
          <div className="mt-8 mb-4">
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300">
              Connect
            </button>
          </div>
        </div>
      </div>

      <div>
        {userPosts?.map((post) => {
          return <PostCard key={post.id} posts={post} />;
        })}
      </div>
    </>
  );
}
