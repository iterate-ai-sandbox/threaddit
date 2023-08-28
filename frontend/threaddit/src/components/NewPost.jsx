import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import avatar from "../assets/avatar.png";
import AuthConsumer from "./AuthContext";
import Spinner from "./Spinner";
import PropTypes from "prop-types";

NewPost.propTypes = {
  setShowModal: PropTypes.func,
};

export default function NewPost({ setShowModal }) {
  const { data, isLoading } = useQuery({
    queryKey: ["threads"],
    queryFn: async () => {
      return axios.get("/api/threads/get/all").then((res) => res.data);
    },
  });
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [media, setMedia] = useState("");
  const [mediaType, setMediaType] = useState("image");
  const [imageUrl, setImageUrl] = useState("");
  const [thread, setThread] = useState(1);
  const { user } = AuthConsumer();
  async function handleSubmit(e) {
    e?.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content_type", mediaType);
    formData.append("content_url", imageUrl);
    formData.append("content", content);
    if (media) {
      formData.append("media", media, media.name);
    }
    formData.append("subthread_id", thread);
    await axios
      .post("/api/post", formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then(() => setShowModal(false))
      .catch((err) => alert(`${err.message} check your fields, Title is mandatory`));
  }
  if (isLoading) return <Spinner />;
  return (
    <div className="flex flex-col p-5 space-y-5 w-5/6 h-4/6 rounded-md md:w-3/4 md:h-5/6 md:p-10 bg-theme-cultured">
      <div className="flex flex-col justify-between items-center p-4 space-y-3 bg-white rounded-xl md:flex-row md:space-y-0">
        <div className="flex space-x-3">
          <p>Posting as</p>
          <img src={user.avatar || avatar} className="w-6 h-6 rounded-full" alt="" />
          <p>{user.username}</p>
        </div>
        <div className="flex items-center space-x-2 md:space-x-3">
          <p className="hidden md:block">Posting on</p>
          <p className="md:hidden">On</p>
          <select
            name="thread"
            id="thread"
            className="px-10 py-2 bg-white rounded-md border md:px-12"
            value={thread}
            onChange={(e) => setThread(Number(e.target.value))}>
            {data?.map((thread) => (
              <option key={thread.name} value={thread.id}>
                {thread.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <form
        encType="multipart/form-data"
        className="flex flex-col flex-1 justify-around p-3 space-y-5 w-full h-1/2 bg-white rounded-md">
        <label htmlFor="title">
          <span>Title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            name="title"
            id="title"
            className="w-full border-b border-gray-800 focus:outline-none"
            required={true}
            maxLength={50}
          />
        </label>
        <label htmlFor="content">
          <span>Content</span>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            name="content"
            id="content"
            className="p-2 w-full border border-gray-800 focus:outline-none"
          />
        </label>
        <label htmlFor="media" className="flex items-center space-x-5">
          <select
            className="px-10 py-2 bg-white rounded-md border md:px-12"
            name="type"
            id="media_type"
            onChange={(e) => setMediaType(e.target.value)}>
            <option value="image">Image</option>
            <option value="url">URL</option>
          </select>
          {mediaType === "image" ? (
            <input
              onChange={(e) => setMedia(e.target.files[0])}
              type="file"
              name="file"
              accept="image/*"
              id="image"
              className="w-full focus:outline-none"
            />
          ) : (
            <input
              type="text"
              name="media_url"
              id="media_url"
              className="p-2 w-full rounded-md border border-gray-800 focus:outline-none"
              onChange={(e) => setImageUrl(e.target.value)}
            />
          )}
        </label>
        <button
          onClick={handleSubmit}
          className="py-2 font-semibold text-white rounded-md bg-theme-orange active:scale-95">
          Submit
        </button>
      </form>
    </div>
  );
}