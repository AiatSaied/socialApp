import React, { useRef, useState } from "react";
import { Button, Dropdown, Label } from "@heroui/react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Modal } from "@heroui/react";
import { PulseLoader } from "react-spinners";

export default function DropDown({ id, posts }) {
  // { id, posts}
  const [modalState, setmodalState] = useState(false);

  let query = useQueryClient();

  let body = useRef();
  let image = useRef();

  const [imageSrc, setimageSrc] = useState(null);
  // Delete Post
  function deletePost() {
    return axios.delete(`https://route-posts.routemisr.com/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  let {
    // data: delData,
    error: delErr,
    isError: delIsErr,
    isPending: delIsPending,
    mutate: delFn,
  } = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["getPosts"] });
      query.invalidateQueries({ queryKey: ["userPosts"] });

      toast.success("Post Deleted Successfully");
    },
    onError: () => {
      toast.error("Cannot Delete Post");
    },
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

  function handlePostData() {
    let formdata = new FormData();

    const postBody = body.current?.value.trim();
    const selectedImage = image.current?.files?.[0];

    if (postBody) {
      formdata.append("body", postBody);
    }

    if (selectedImage) {
      formdata.append("image", selectedImage);
    }

    return formdata;
  }

  function updatePost() {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${id}`,
      handlePostData(),
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  let {
    // data: updateData,
    isPending: updateIsPending,
    error: updateErr,
    isError: updateIsErr,
    mutate: updateFn,
  } = useMutation({
    mutationFn: updatePost,

    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["getPosts"] });
      query.invalidateQueries({ queryKey: ["userPosts"] });

      setmodalState(false);

      if (body.current) {
        body.current.value = "";
      }
      if (image.current) {
        image.current.value = "";
      }
      setimageSrc(null);

      toast.success("Post Updated Successfully");
    },
    onError: () => {
      toast.error("Cannot Update Post");
    },
  });

  function handleUpdatePost() {
    const postBody = body.current?.value.trim();
    const selectedImage = image.current?.files?.[0];

    if (!postBody && !selectedImage) {
      toast.error("Please write something or choose an image.");
      return;
    }

    updateFn();
  }

  if (delIsPending) {
    return (
      <div className="h-screen flex justify-center items-center">
        <PulseLoader color="lightseagreen" />
      </div>
    );
  }

  if (delIsErr) {
    return (
      <div className="h-screen flex justify-center items-center text-red-600 font-semibold">
        <h2>{delErr.message}</h2>
      </div>
    );
  }

  if (updateIsErr) {
    return (
      <div className="h-screen flex justify-center items-center text-red-600 font-semibold">
        <h2>{updateErr.message}</h2>
      </div>
    );
  }
  return (
    <>
      <Dropdown>
        <Button aria-label="Menu" variant="secondary" isDisabled={delIsPending}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
            />
          </svg>
        </Button>
        <Dropdown.Popover>
          <Dropdown.Menu
            onAction={(key) => {
              console.log(`Selected: ${key}`);
              // if (key == "edit-file") {
              //   setmodalState(true);
              // }
              if (key === "edit-post") {
                setmodalState(true);
              }

              if (key === "delete-post") {
                delFn();
              }
            }}
          >
            <Dropdown.Item
              id="edit-post"
              textValue="Edit post"
              variant="secondary"
              className="font-medium"
            >
              Update Post
            </Dropdown.Item>
            <Dropdown.Item
              id="delete-post"
              textValue="Delete post"
              variant="danger"
              className="text-red-600 font-medium"
            >
              {/* <button className="text-red-600" onClick={delFn}> */}
              Delete Post
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>

      {/* Start Modal */}
      <Modal isOpen={modalState} onOpenChange={setmodalState}>
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog className="sm:max-w-[500px]">
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Heading>Update Post</Modal.Heading>
              </Modal.Header>

              <Modal.Body>
                <div className="flex gap-3 items-end">
                  <textarea
                    ref={body}
                    defaultValue={posts?.body || ""}
                    className="w-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 p-4 rounded-xl outline-none resize-none transition"
                    rows="4"
                    placeholder="What's on your mind?"
                  />

                  <label
                    htmlFor="upload"
                    className="cursor-pointer flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 text-gray-600 transition"
                    title="Add image"
                  >
                    <i className="fa-regular fa-image text-2xl"></i>
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
                  onClick={handleUpdatePost}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold"
                  slot="close"
                  disabled={updateIsPending}
                >
                  {updateIsPending ? (
                    <i className="fa fa-spin fa-spinner"></i>
                  ) : (
                    "Update Post"
                  )}
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
      {/* End Modal */}
    </>
  );
}
