import React, { useContext, useRef, useState } from "react";
import { Button, Modal } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";
import { UserData } from "../Context/UserData";

export default function CreatePost() {
  let { data: userData } = useContext(UserData);

  let query = useQueryClient();

  let body = useRef(); // {current: }
  let image = useRef();

  const [imageSrc, setimageSrc] = useState(null);

  function previewImage(e) {
    // console.log(e.target.files[0]);
    setimageSrc(URL.createObjectURL(e.target.files[0]));
  }

  function closeImage() {
    setimageSrc(null);
  }

  function handlePostData() {
    let formdata = new FormData();

    if (body.current.value) {
      formdata.append("body", body.current.value);
    }

    if (image.current.files[0]) {
      formdata.append("image", image.current.files[0]);
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

  let { data, error, isError, isPending, mutate } = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      // setimageSrc(null);
      query.invalidateQueries({ queryKey: ["getPosts"] });
      toast.success("Post Created Successfully");
    },
    onError: () => {
      toast.error("Cannot Create Post");
    },
  });

  return (
    <>
      {/* Start Modal */}
      <Modal>
        <section className="bg-gray-200 p-4 rounded shadow w-1/2 mx-auto my-4 py-6">
          <div className="flex items-center space-x-3 mb-4">
            <img
              src={userData?.photo}
              alt="User"
              className="h-10 w-10 rounded-full"
            />
            <Button variant="secondary" className="w-full bg-white">
              <input
                type="text"
                placeholder="What's on your mind?"
                className=""
              />
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
                      className="w-full border p-4 rounded-xs"
                      rows="4"
                      placeholder="Enter Your Post"
                      id=""
                    ></textarea>
                    <label htmlFor="upload">
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
                          d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                        />
                      </svg>
                    </label>
                    <input
                      ref={image}
                      onChange={previewImage}
                      id="upload"
                      type="file"
                      hidden
                    />
                  </div>
                  <div className="relative">
                    <svg
                      onClick={closeImage}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6 absolute top-2 right-2 text-red-600 "
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>

                    <img
                      className="w-full mt-4"
                      src={imageSrc}
                      alt="Choose Image"
                    />
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button onClick={mutate} className="w-full" slot="close">
                    Create Post
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
