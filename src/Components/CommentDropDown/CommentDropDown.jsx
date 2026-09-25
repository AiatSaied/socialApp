import React, { useRef, useState } from "react";
import { Button, Dropdown, Modal } from "@heroui/react";

import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function CommentDropDown({ comment }) {
  const [modalState, setmodalState] = useState(false);

  let query = useQueryClient();

  let body = useRef();
  let image = useRef();

  const [imageSrc, setimageSrc] = useState(null);

  // Delete Comment
  function deleteComment() {
    return axios.delete(
      `https://route-posts.routemisr.com/posts/${comment.post}/comments/${comment._id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  let { isPending: deleteIsPending, mutate: deleteFn } = useMutation({
    mutationFn: deleteComment,

    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["getPosts"] });
      query.invalidateQueries({ queryKey: ["getComments", comment.post] });
      query.invalidateQueries({ queryKey: ["userPosts"] });

      toast.success("Comment Deleted Successfully");
    },
    onError: (error) => {
      console.log("Delete Comment Error:", error);
      console.log("Response:", error.response);
      console.log("Response Data:", error.response?.data);

      toast.error(error.response?.data?.message || "Cannot Delete Comment");
    },
    // onError: () => {
    //   toast.error("Cannot Delete Comment");
    // },
  });

  function previewImage(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    setimageSrc(URL.createObjectURL(file));
  }

  function closeImage() {
    setimageSrc(null);

    if (image.current) {
      image.current.value = "";
    }
  }

  function handleCommentData() {
    let formdata = new FormData();

    const commentBody = body.current?.value.trim();
    const selectedImage = image.current?.files?.[0];

    if (commentBody) {
      formdata.append("content", commentBody);
    }

    if (selectedImage) {
      formdata.append("image", selectedImage);
    }

    return formdata;
  }

  // Update Comment
  function updateComment() {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${comment.post}/comments/${comment._id}`,
      handleCommentData(),
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  let { isPending: updateIsPending, mutate: updateFn } = useMutation({
    mutationFn: updateComment,

    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["getPosts"] });
      query.invalidateQueries({ queryKey: ["getComments", comment.post] });
      query.invalidateQueries({ queryKey: ["userPosts"] });

      setmodalState(false);

      if (body.current) {
        body.current.value = "";
      }

      if (image.current) {
        image.current.value = "";
      }

      setimageSrc(null);

      toast.success("Comment Updated Successfully");
    },

    onError: () => {
      toast.error("Cannot Update Comment");
    },
  });

  function handleUpdateComment() {
    const commentBody = body.current?.value.trim();
    const selectedImage = image.current?.files?.[0];

    if (!commentBody && !selectedImage) {
      toast.error("Please write a comment or choose an image.");
      return;
    }

    updateFn();
  }

  return (
    <>
      <Dropdown>
        <Button
          aria-label="Comment Menu"
          variant="secondary"
          isDisabled={deleteIsPending}
          className="min-w-0 p-1 bg-transparent"
        >
          <i className="fa-solid fa-ellipsis text-gray-400"></i>
        </Button>

        <Dropdown.Popover>
          <Dropdown.Menu
            onAction={(key) => {
              if (key === "edit-comment") {
                setmodalState(true);
              }

              if (key === "delete-comment") {
                deleteFn();
              }
            }}
          >
            <Dropdown.Item id="edit-comment" textValue="Edit comment">
              Update Comment
            </Dropdown.Item>

            <Dropdown.Item
              id="delete-comment"
              textValue="Delete comment"
              variant="danger"
            >
              Delete Comment
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>

      {/* Update Comment Modal */}
      <Modal isOpen={modalState} onOpenChange={setmodalState}>
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog className="sm:max-w-[500px]">
              <Modal.CloseTrigger />

              <Modal.Header>
                <Modal.Heading>Update Comment</Modal.Heading>
              </Modal.Header>

              <Modal.Body>
                <div className="flex gap-3 items-end">
                  <textarea
                    ref={body}
                    defaultValue={comment?.content || ""}
                    className="w-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 p-4 rounded-xl outline-none resize-none transition"
                    rows="4"
                    placeholder="Write your comment..."
                  />

                  <label
                    htmlFor="upload"
                    className="cursor-pointer flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 text-gray-600 transition"
                    title="Add image"
                  >
                    <i className="fa-regular fa-image text-xl"></i>
                  </label>

                  <input
                    ref={image}
                    onChange={previewImage}
                    id="upload"
                    type="file"
                    hidden
                  />
                </div>

                {imageSrc && (
                  <div className="relative mt-4">
                    <button
                      type="button"
                      onClick={closeImage}
                      className="absolute top-2 right-2 z-10 bg-black/60 hover:bg-black/75 text-white rounded-full w-8 h-8 flex items-center justify-center transition"
                      aria-label="Remove selected image"
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>

                    <img
                      className="w-full max-h-80 object-cover rounded-xl"
                      src={imageSrc}
                      alt="Selected"
                    />
                  </div>
                )}
              </Modal.Body>

              <Modal.Footer>
                <Button
                  onClick={handleUpdateComment}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold"
                  disabled={updateIsPending}
                >
                  {updateIsPending ? (
                    <i className="fa fa-spin fa-spinner"></i>
                  ) : (
                    "Update Comment"
                  )}
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </>
  );
}
