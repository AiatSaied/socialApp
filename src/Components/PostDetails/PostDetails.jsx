import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { useParams } from "react-router-dom";
import SingleComment from "../SingleComment/SingleComment";
import CreateComment from "../CreateComment/CreateComment";
import { PulseLoader } from "react-spinners";

export default function PostDetails() {
  let { id } = useParams(); // {id: postid}

  function getAllComments() {
    return axios.get(
      `https://route-posts.routemisr.com/posts/${id}/comments?page=1&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  let {
    data: comments,
    error: commentsError,
    isError: commentsIsError,
    isLoading: commentsIsLoading,
  } = useQuery({
    queryKey: ["getComments", id],
    queryFn: getAllComments,
    select: (res) => res?.data.data.comments,
  });
  // console.log(comments); // [{}, {}]

  function getPostDetails() {
    return axios.get(`https://route-posts.routemisr.com/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  let { data, error, isError, isLoading } = useQuery({
    queryKey: ["postDetails", id],
    queryFn: getPostDetails,
    select: (res) => res?.data.data.post,
  });

  // console.log(data);
  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <PulseLoader color="lightseagreen" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex justify-center items-center px-4">
        <div className="text-center">
          <h2 className="text-red-600 font-semibold text-lg">
            {error?.message || "Something went wrong while loading the post."}
          </h2>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Post Details */}
      <div className="min-h-screen bg-gray-100 px-4 py-6">
        <div className="max-w-3xl mx-auto">
          {/* Post */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-200">
            {/* Post Header */}
            <header className="flex items-start gap-3 mb-4">
              <img
                src={data?.user?.photo}
                className="w-11 h-11 rounded-full object-cover border border-gray-200"
                alt={data?.user?.name || "User"}
              />
              <div>
                <p className="font-semibold text-gray-800">
                  {data?.user?.name}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {data?.createdAt &&
                    new Date(data.createdAt).toLocaleDateString()}
                </p>
              </div>
            </header>
            {/* Post Body */}
            {data?.body && (
              <p className="text-gray-800 leading-relaxed mb-4 whitespace-pre-wrap">
                {data.body}
              </p>
            )}
            {/* Post Image */}
            {data?.image && (
              <img
                src={data.image}
                alt="Post"
                className="w-full max-h-[500px] object-cover rounded-xl mb-4"
              />
            )}
            {/* Post Actions */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-gray-600 text-sm font-medium">
              <button className="flex items-center gap-2 hover:text-blue-600 transition">
                <i className="fas fa-thumbs-up"></i>
                <span>{data?.likesCount} Like</span>
              </button>
              <button className="flex items-center gap-2 hover:text-blue-600 transition">
                <i className="fas fa-comment"></i> <span>Comment</span>
              </button>
              <button className="flex items-center gap-2 hover:text-blue-600 transition">
                <i className="fas fa-share"></i> <span>Share</span>
              </button>
            </div>
            {/* Add Comment */}
            <div className="mt-5">
              <CreateComment id={id} />
            </div>
          </div>
          {/* Comments */}
          <div className="mt-6">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-800">Comments</h2>
              <p className="text-sm text-gray-500 mt-1">
                {comments?.length || 0}
                {comments?.length === 1 ? " comment" : " comments"}
              </p>
            </div>
            {commentsIsLoading && (
              <div className="flex justify-center py-8">
                <PulseLoader color="lightseagreen" size={8} />
              </div>
            )}
            {commentsIsError && (
              <div className="bg-white border border-red-100 rounded-xl p-5 text-center">
                <p className="text-red-600 text-sm">
                  {commentsError?.message ||
                    "Something went wrong while loading comments."}
                </p>
              </div>
            )}
            {!commentsIsLoading && !commentsIsError && comments?.length > 0 && (
              <div className="space-y-3">
                {comments.map((comm) => (
                  <SingleComment key={comm._id} comment={comm} />
                ))}
              </div>
            )}
            {!commentsIsLoading &&
              !commentsIsError &&
              comments?.length === 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                  <i className="fa-regular fa-comments text-4xl text-gray-300"></i>
                  <h3 className="text-lg font-semibold text-gray-700 mt-4">
                    No comments yet
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Be the first to comment on this post.
                  </p>
                </div>
              )}
          </div>
        </div>
      </div>
    </>
  );
}
