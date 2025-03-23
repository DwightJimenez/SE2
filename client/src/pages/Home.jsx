import React, { useState } from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CreatePost from "./CreatePost";
import PostButton from "../components/PostButton";
import Linkify from "react-linkify";
import Chat from "./Chat";
import CommentsSection from "./CommentsSection";

const fetchPosts = async () => {
  const response = await axios.get("http://localhost:4001/posts", {
    withCredentials: true,
  });
  return response.data;
};

const Home = () => {
  const auth = JSON.parse(sessionStorage.getItem("authState"));

  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    staleTime: 1000 * 60 * 5,
  });

  const [expandedPost, setExpandedPost] = useState(null);

  const queryClient = useQueryClient();

  const deletePostMutation = useMutation({
    mutationFn: async (postId) => {
      await axios.delete(`http://localhost:4001/posts/delete/${postId}`, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });
  const handleDeletePost = (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deletePostMutation.mutate(postId);
    }
  };

  const likePostMutation = useMutation({
    mutationFn: async (postId) => {
      await axios.post(
        `http://localhost:4001/posts/like/${postId}`,
        {},
        {
          withCredentials: true,
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  const handleLikePost = (postId) => {
    likePostMutation.mutate(postId);
  };

  if (isLoading) return <p>Loading posts...</p>;
  if (isError) return <p className="text-red-500">Error loading posts.</p>;

  return (
    <div className="flex flex-col space-y-4 p-4 bg-gray-100">
      <div className="relative">
        <PostButton />
        <div
          className="dropdown menu w-160 h-100 rounded-box bg-base-100 shadow-sm "
          popover="auto"
          id="popover-1"
          style={{ positionAnchor: "--anchor-1" } /* as React.CSSProperties */}
        >
          <CreatePost />
        </div>
      </div>

      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        <Linkify
          componentDecorator={(href, text, key) => (
            <a
              href={href}
              key={key}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              {text}
            </a>
          )}
        >
          <div className="space-y-4 max-w-200">
            {posts.map((post) => (
              <div key={post.id} className="card bg-base-100 shadow-sm p-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">@{post.username}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleString()}
                    </span>

                    {auth.username === post.username && (
                      <span
                        onClick={() => handleDeletePost(post.id)}
                        className="absolute top-4 right-4 cursor-pointer"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-4"
                          color="red"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </span>
                    )}
                  </div>
                  <p className="my-4">{post.text}</p>
                  <span className="divider"></span>
                  <div className="flex justify-evenly">
                    <span
                      className="flex cursor-pointer"
                      onClick={() => handleLikePost(post.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill={post.likedByUser ? "blue" : "none"}

                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                        />
                      </svg>
                      <p className="px-2">{post.likes}</p>
                      <p
                        className={`px-2 ${
                          post.likedByUser ? "text-blue-500" : "text-gray-500"
                        }`}
                      >
                        Like
                      </p>
                    </span>
                    <span
                      className="flex cursor-pointer"
                      onClick={() =>
                        setExpandedPost(
                          expandedPost === post.id ? null : post.id
                        )
                      }
                    >
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
                          d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                        />
                      </svg>
                      <p className="px-2">Comment</p>
                    </span>
                  </div>
                </div>

                {expandedPost === post.id && (
                  <CommentsSection PostId={post.id} />
                )}
              </div>
            ))}
          </div>
        </Linkify>
      )}
      <div className="fixed w-100 h-100 bg-white right-4 bottom-0 z-50 p-4 rounded-lg shadow-lg dark:bg-gray-900">
        <Chat />
      </div>
    </div>
  );
};

export default Home;
