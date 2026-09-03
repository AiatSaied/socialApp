import React from "react";
import SingleComment from "../SingleComment/SingleComment";
import { Link } from "react-router-dom";
import CreateComment from "../CreateComment/CreateComment";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function PostCard({ posts }) {
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

  console.log(likeData?.data?.data.liked);

  return (
    <>
      <div className="bg-gray-100 p-4 rounded shadow w-1/2 mx-auto my-3">
        <Link to={`postdetails/${posts.id}`}>
          <header className="flex items-center space-x-3 mb-3">
            <img
              src={posts.user.photo}
              className="w-10 h-10 rounded-full"
              alt="User Image"
            />
            <div>
              <p className="font-semibold">{posts.user.name}</p>
              <p className="text-xs text-gray-500">{posts.createdAt}</p>
            </div>
          </header>
        </Link>
        {posts.body && <p className="mb-3">{posts.body}</p>}
        {posts.image && (
          <img
            src={posts.image}
            alt="Post Image"
            className="rounded max-h-96 w-full object-cover mb-3"
          />
        )}
        <div className="flex justify-between text-gray-600 text-sm font-semibold">
          <button
            onClick={likeFn}
            className={`flex items-center space-x-1 hover:text-blue-600 ${likeData?.data?.data.liked ? "text-blue-600" : ""}`}
          >
            <i className="fas fa-thumbs-up" />
            <span>{posts.likesCount} Like</span>
          </button>
          <button className="flex items-center space-x-1 hover:text-blue-600">
            <i className="fas fa-comment" />
            <span>Comment</span>
          </button>
          <button className="flex items-center space-x-1 hover:text-blue-600">
            <i className="fas fa-share" />
            <span>Share</span>
          </button>
        </div>

        {/* Start Add Comment */}
        <CreateComment id={posts.id} />
        {/* End Add Comment */}

        {/* Single Comment */}
        {posts.topComment !== null ? (
          <SingleComment comment={posts.topComment} />
        ) : (
          ""
        )}
      </div>
    </>
  );
}
