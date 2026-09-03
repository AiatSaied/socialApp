import React from "react";

export default function SingleComment({ comment }) {
  // console.log(comment); // { content, commentCreator:{}, commentCreator.name , commentCreator.photo}

  return (
    <>
      <header className="flex items-center space-x-3 mb-3 border my-3 rounded-2xl p-2">
        <img
          src={comment?.commentCreator?.photo}
          className="w-10 h-10 rounded-full"
          alt="User Image"
        />
        <div>
          <p className="font-semibold">{comment?.commentCreator?.name}</p>
          <p className="text-xs text-gray-500">{comment?.content}</p>
        </div>
      </header>
    </>
  );
}
