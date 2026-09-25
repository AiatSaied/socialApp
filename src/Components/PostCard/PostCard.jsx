import React, { useContext } from "react";
import SingleComment from "../SingleComment/SingleComment";
import { Link } from "react-router-dom";
import CreateComment from "../CreateComment/CreateComment";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import DropDown from "../DropDown/DropDown";
import { UserData } from "../Context/UserData";

export default function PostCard({ posts }) {
  let { data: userData } = useContext(UserData);

  // console.log(userData);

  // console.log(posts); // {body, createdAt, image, likesCount , topComment, user.name, user.photo, id , user}
  let query = useQueryClient();

  function likePost() {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${posts.id}/like`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  let {
    data: likeData,
    error: likeError,
    isError: likeIsErr,
    mutate: likeFn,
  } = useMutation({
    mutationFn: likePost,
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["getPosts"] });

      query.invalidateQueries({ queryKey: ["userPosts"] });
      toast.success("Liked");
    },
    onError: () => {
      toast.error("Cannot Like Post");
    },
  });

  // console.log(likeData?.data?.data.liked);

  if (likeIsErr) {
    return (
      <div className="h-screen flex justify-center items-center text-red-600 font-semibold">
        <h2>{likeError.message}</h2>
      </div>
    );
  }
  return (
    <>
      <div className="w-full bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-200 mx-auto">
        <header className="flex justify-between items-start gap-3 mb-4">
          <Link to={`postdetails/${posts.id}`}>
            <div className="flex gap-3">
              <img
                src={posts.user.photo}
                className="w-11 h-11 rounded-full object-cover border border-gray-200"
                alt="User Image"
              />
              <div>
                <p className="font-semibold text-gray-800">{posts.user.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {new Date(posts?.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Link>
          {/* Start DropDown */}
          <div>
            {posts.user._id === userData._id && (
              <DropDown id={posts.id} posts={posts} />
            )}
          </div>
          {/* End DropDown */}
        </header>

        {posts.body && (
          <p className="text-gray-800 leading-relaxed mb-4 whitespace-pre-wrap">
            {posts.body}
          </p>
        )}

        {posts.image && (
          <img
            src={posts.image}
            alt="Post Image"
            className="w-full max-h-[500px] object-cover rounded-xl mb-4"
          />
        )}

        <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-gray-600 text-sm font-medium">
          <button
            onClick={likeFn}
            className={`flex items-center justify-center gap-2 py-2 rounded-lg transition ${
              likeData?.data?.data.liked
                ? "text-blue-600 bg-blue-50"
                : "hover:text-blue-600 hover:bg-gray-50"
            }`}
          >
            <i className="fas fa-thumbs-up" />
            <span>{posts.likesCount} Like</span>
          </button>

          <button className="flex items-center justify-center gap-2 py-2 rounded-lg hover:text-blue-600 hover:bg-gray-50 transition">
            <i className="fas fa-comment" />
            <span>Comment</span>
          </button>

          <button className="flex items-center justify-center gap-2 py-2 rounded-lg hover:text-blue-600 hover:bg-gray-50 transition">
            <i className="fas fa-share" />
            <span>Share</span>
          </button>
        </div>

        {/* Start Add Comment */}
        <CreateComment id={posts.id} />
        {/* End Add Comment */}

        {/* Single Comment */}
        {posts.topComment !== null && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <SingleComment comment={posts.topComment} />
          </div>
        )}
      </div>
    </>
  );
}
