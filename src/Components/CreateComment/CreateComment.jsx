import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { PulseLoader } from "react-spinners";
import { toast } from "react-toastify";

export default function CreateComment({ id }) {
  let query = useQueryClient();

  let { register, handleSubmit, reset } = useForm({
    defaultValues: {
      content: "",
      image: "",
    },
  });

  function addComment(formdata) {
    return axios.post(
      `https://route-posts.routemisr.com/posts/${id}/comments`,
      formdata,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }
  // data, error, isError
  let { isPending, mutate } = useMutation({
    mutationFn: addComment,
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["getPosts"] });
      query.invalidateQueries({ queryKey: ["getComments", id] });

      reset();
      toast.success("Created Comment successfully");
    },
    onError: () => {
      toast.error("Cannot add comment");
    },
  });

  function handleComment(values) {
    let formdata = new FormData();
    console.log(values); // {content: "", image: Filelist}

    // if (!values.content && !values.image) return;

    const selectedImage = values.image?.[0];

    if (!values.content?.trim() && !selectedImage) {
      toast.error("Please write a comment or choose an image.");
      return;
    }

    if (values.content) {
      formdata.append("content", values.content);
    }

    if (selectedImage) {
      formdata.append("image", selectedImage);
    }

    // Call API
    mutate(formdata);
  }

  // if (isPending) {
  //   return (
  //     <div className="h-screen flex justify-center items-center">
  //       <PulseLoader color="lightseagreen" />
  //     </div>
  //   );
  // }

  // if (isError) {
  //   return (
  //     <div className="h-screen flex justify-center items-center text-red-600 font-semibold">
  //       <h2>{error.message}</h2>
  //     </div>
  //   );
  // }

  return (
    <>
      <form
        onSubmit={handleSubmit(handleComment)}
        className="max-w-2xl mx-auto mt-10 bg-white rounded-2xl border border-gray-200 shadow-sm p-4"
      >
        <div className="flex items-center gap-3">
          {/* Image upload */}
          <label
            htmlFor="image"
            className="cursor-pointer p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-indigo-500 transition-colors"
            title="Add image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 23 23"
              strokeWidth={1.8}
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
          </label>

          <input {...register("image")} id="image" type="file" hidden />

          {/* Comment input */}
          <input
            {...register("content")}
            type="text"
            placeholder="Write a comment..."
            className="flex-1 bg-gray-100 rounded-full border-0 py-2.5 px-4 text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:bg-white transition"
          />

          {/* Comment button */}
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white text-sm font-medium transition-colors"
          >
            {isPending ? (
              <PulseLoader color="lightseagreen" size={5} />
            ) : (
              // <svg
              //   xmlns="http://www.w3.org/2000/svg"
              //   fill="none"
              //   viewBox="0 0 24 24"
              //   strokeWidth={1.8}
              //   stroke="currentColor"
              //   className="size-4"
              // >
              //   <path
              //     strokeLinecap="round"
              //     strokeLinejoin="round"
              //     d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
              //   />
              // </svg>
              <i className="fa-solid fa-paper-plane"></i>
            )}
          </button>
        </div>
      </form>
    </>
  );
}
