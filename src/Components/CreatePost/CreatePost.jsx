import React, { useContext, useRef, useState } from "react";
import { Button, Modal } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";
import { UserData } from "../Context/UserData";
// import { PulseLoader } from "react-spinners";

export default function CreatePost() {
  let { data: userData } = useContext(UserData);

  let query = useQueryClient();

  let body = useRef(); // {current: }
  let image = useRef();

  const [imageSrc, setimageSrc] = useState(null);

  function previewImage(e) {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

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

  function createPost() {
    return axios.post(
      `https://route-posts.routemisr.com/posts`,
      handlePostData(),
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  let { error, isError, isPending, mutate } = useMutation({
    mutationFn: createPost,

    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["getPosts"] });
      query.invalidateQueries({ queryKey: ["userPosts"] });

      if (body.current) {
        body.current.value = "";
      }

      if (image.current) {
        image.current.value = "";
      }

      setimageSrc(null);

      toast.success("Post Created Successfully");
    },

    onError: () => {
      toast.error("Cannot Create Post");
    },
  });

  function handleCreatePost() {
    const postBody = body.current?.value.trim();
    const selectedImage = image.current?.files?.[0];

    if (!postBody && !selectedImage) {
      toast.error("Please write something or choose an image.");
      return;
    }

    mutate();
  }

  // if (isPending) {
  //   return (
  //     <div className="h-screen flex justify-center items-center">
  //       <PulseLoader color="lightseagreen" />
  //     </div>
  //   );
  // }

  if (isError) {
    return (
      <div className="h-screen flex justify-center items-center text-red-600 font-semibold">
        <h2>{error.message}</h2>
      </div>
    );
  }

  return (
    <>
      {/* Start Modal */}
      <Modal>
        <section className="w-full bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-200 mx-auto mb-6">
          <div className="flex items-center gap-3">
            <img
              src={userData?.photo}
              alt={`${userData?.name || "User"} profile`}
              className="h-11 w-11 rounded-full object-cover border border-gray-200"
            />

            <Button
              variant="secondary"
              className="flex-1 justify-start bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full px-5"
            >
              What's on your mind?
            </Button>
          </div>
          <Modal.Backdrop>
            <Modal.Container>
              <Modal.Dialog className="sm:max-w-[360px]">
                <Modal.CloseTrigger />
                <Modal.Header>
                  <Modal.Heading>Add Post</Modal.Heading>
                </Modal.Header>

                <Modal.Body>
                  <div className="flex gap-3 items-end">
                    <textarea
                      ref={body}
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
                    onClick={handleCreatePost}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg"
                    slot="close"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <i className="fa fa-spin fa-spinner"></i>
                    ) : (
                      "Create Post"
                    )}
                  </Button>
                </Modal.Footer>
              </Modal.Dialog>
            </Modal.Container>
          </Modal.Backdrop>
        </section>
      </Modal>
      {/* End Modal */}
    </>
  );
}
