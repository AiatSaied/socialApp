import React, { useContext } from "react";
import { UserData } from "../Context/UserData";
import CommentDropDown from "../CommentDropDown/CommentDropDown";

export default function SingleComment({ comment }) {
  // console.log(comment); // { content, commentCreator:{}, commentCreator.name , commentCreator.photo}
  let { data: userData } = useContext(UserData);

  return (
    <>
      <div className="border border-gray-200 rounded-4xl px-3 py-4 m-2">
        <div className="flex items-start gap-3">
          {/* User Image */}
          <img
            src={comment?.commentCreator?.photo}
            alt={comment?.commentCreator?.name || "User"}
            className="w-10 h-10 rounded-full object-cover border border-gray-200 flex-shrink-0"
          />

          {/* Comment */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-sm text-gray-800">
                {comment?.commentCreator?.name}
              </p>

              <p className="text-xs text-gray-400">
                {new Date(comment?.createdAt).toLocaleDateString()}
              </p>

              {/* Update/Delete */}
              {comment?.commentCreator?._id === userData?._id && (
                <div className="ml-auto">
                  <CommentDropDown comment={comment} />
                </div>
              )}
            </div>

            <p className="text-sm text-gray-700 mt-1 break-words">
              {comment?.content}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
