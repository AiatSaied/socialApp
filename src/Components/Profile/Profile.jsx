import React, { useContext } from "react";
import { UserData } from "../Context/UserData";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import PostCard from "../PostCard/PostCard";
import { Helmet } from "react-helmet";
import { PulseLoader } from "react-spinners";

import { Link } from "react-router-dom";

export default function Profile() {
  let { data } = useContext(UserData);
  // console.log(data);

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

  let {
    data: userPosts,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["userPosts"],
    queryFn: getUserPosts,
    select: (res) => res?.data?.data?.posts,
  });

  // console.log(userPosts); // [ {}, {}]

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <PulseLoader color="lightseagreen" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex justify-center items-center px-4">
        <div className="text-center">
          <h2 className="text-red-600 font-semibold text-lg">
            {error?.message || "Something went wrong while loading your posts."}
          </h2>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Profile</title>
      </Helmet>

      <div className="min-h-screen bg-gray-100 py-6 px-4">
        {/* Profile Card */}
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="h-36 sm:h-48 bg-gradient-to-r from-purple-400 to-pink-300" />

          {/* Profile Information */}
          <div className="px-5 sm:px-8 pb-6">
            {/* Profile Image */}
            <div className="-mt-16 sm:-mt-20 mb-4">
              <img
                src={data?.photo}
                alt={`${data?.name || "User"} profile`}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-white shadow-lg object-cover bg-gray-200"
              />
            </div>

            {/* User Info */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  {data?.name}
                </h1>

                {data?.username && (
                  <p className="text-gray-500 mt-1">@{data.username}</p>
                )}

                {data?.dateOfBirth && (
                  <p className="text-sm text-gray-500 mt-3">
                    <i className="fa-regular fa-calendar mr-2"></i>
                    {data.dateOfBirth}
                  </p>
                )}
              </div>

              {/* Profile Actions */}
              <div className="flex flex-col sm:flex-row gap-2">
                <Link
                  to="/change-password"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition duration-200"
                >
                  <i className="fa-solid fa-lock"></i>
                  Change Password
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* User Posts */}
        <div className="max-w-3xl mx-auto mt-8">
          <div className="mb-5">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              My Posts
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Posts shared by {data?.name || "this user"}
            </p>
          </div>

          {userPosts?.length > 0 ? (
            <div className="space-y-5">
              {userPosts.map((post) => (
                <PostCard key={post.id} posts={post} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <i className="fa-regular fa-file-lines text-4xl text-gray-300"></i>

              <h3 className="text-lg font-semibold text-gray-700 mt-4">
                No posts yet
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                You haven't shared any posts yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// return (
//   <>
//     <Helmet>
//       <title>Profile</title>
//     </Helmet>

//     <div className="relative w-full m-auto my-5 max-w-md bg-white shadow-xl rounded-lg overflow-hidden animate-fade-in">
//       {/* Cover Image Section */}
//       <div
//         className="h-40 bg-cover bg-center cover-gradient-fallback"
//         style={{
//           backgroundImage: `url(${data?.photo})`,
//         }}
//       >
//         {/* You can replace the URL with your desired cover image */}
//       </div>
//       {/* Profile Picture and Details Section */}
//       <div className="relative px-6 -mt-20">
//         {/* Profile Picture */}
//         <img
//           className="w-32 h-32 rounded-full border-4 border-white mx-auto shadow-md object-cover"
//           src={data?.photo}
//           alt="Profile Picture"
//         />
//         {/* You can replace the URL with your desired profile picture */}
//         {/* User Info */}
//         <div className="text-center mt-4">
//           <h2 className="text-2xl font-semibold text-gray-800">{data?.name}</h2>
//           <p className="text-gray-600">{data?.dateOfBirth}</p>
//           <p className="text-sm text-gray-500 mt-2">
//             Passionate about creating intuitive and beautiful web experiences.
//           </p>
//         </div>
//         {/* Optional: Social Links or Stats */}
//         <div className="flex justify-center mt-6 space-x-4 border-t pt-6 border-gray-100">
//           <div className="text-center">
//             <p className="font-bold text-lg text-gray-800">1.2K</p>
//             <p className="text-gray-500 text-sm">Followers</p>
//           </div>
//           <div className="text-center">
//             <p className="font-bold text-lg text-gray-800">250</p>
//             <p className="text-gray-500 text-sm">Following</p>
//           </div>
//           <div className="text-center">
//             <p className="font-bold text-lg text-gray-800">50</p>
//             <p className="text-gray-500 text-sm">Projects</p>
//           </div>
//         </div>
//         {/* Call to Action Button (Optional) */}
//         <div className="mt-8 mb-4">
//           <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300">
//             Connect
//           </button>
//         </div>
//       </div>
//     </div>

//     <div>
//       {userPosts?.map((post) => {
//         return <PostCard key={post.id} posts={post} />;
//       })}
//     </div>
//   </>
// );
