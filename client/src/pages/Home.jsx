import React, { useState, useContext } from "react";
import axios from "axios";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import PostButton from "../components/PostButton";
import Linkify from "react-linkify";
import Chat from "./Chat";
import CommentsSection from "./CommentsSection";
import { AuthContext } from "../helpers/AuthContext";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const LoadingSkeleton = () => {
  return (
    <div className="w-200 justify-center flex flex-col items-center p-4 bg-white dark:bg-gray-800">
      <span className="loading loading-spinner text-primary"></span>
      <div className="flex w-200 flex-col gap-4 mt-4">
        <div className="skeleton h-32 w-full"></div>
        <div className="skeleton h-4 w-28"></div>
        <div className="skeleton h-4 w-full"></div>
        <div className="skeleton h-4 w-full"></div>
      </div>
      <div className="flex w-200 flex-col gap-4 mt-4">
        <div className="skeleton h-32 w-full"></div>
        <div className="skeleton h-4 w-28"></div>
        <div className="skeleton h-4 w-full"></div>
        <div className="skeleton h-4 w-full"></div>
      </div>
    </div>
  );
};

const fetchPosts = async ({ pageParam = 1 }) => {
  const res = await axios.get(
    `http://localhost:4001/posts/?page=${pageParam}&limit=5`,
    {
      withCredentials: true,
    }
  );
  return {
    ...res.data,
    nextPage: res.data.posts.length === 5 ? pageParam + 1 : undefined,
  };
};

const Home = () => {
  const { authState, eventState } = useContext(AuthContext);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 1000 * 60 * 5,
  });

  const [expandedPost, setExpandedPost] = useState(null);
  const allPosts = data?.pages.flatMap((page) => page.posts) || [];
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
    deletePostMutation.mutate(postId);
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

  if (isError) return <p className="text-red-500">Error loading posts.</p>;

  return (
    <div className="flex">
      <div className="flex flex-col space-y-4 p-4 bg-white dark:bg-gray-800">
        <div className="relative">
          <PostButton />
        </div>

        {isLoading ? (
          <LoadingSkeleton />
        ) : allPosts.length === 0 ? (
          <div className="w-200">
            <p className="flex justify-center">No posts available.</p>
          </div>
        ) : (
          <InfiniteScroll
            dataLength={allPosts.length}
            next={fetchNextPage}
            hasMore={hasNextPage}
            loader={<LoadingSkeleton />}
            endMessage={
              <p className="flex justify-center max-w-200 mt-15">
                No more posts.
              </p>
            }
          >
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
                {allPosts.map((post) => (
                  <div
                    key={post.id}
                    className="relative z-10 card bg-white border border-gray-300 shadow-2xl p-4"
                  >
                    <div>
                      <div className="flex flex-col space-x-2">
                        <span className="font-semibold">@{post.username}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(post.createdAt).toLocaleString()}
                        </span>
                      </div>
                      {authState.username === post.username && (
                        <div className="dropdown dropdown-center absolute top-4 right-4 cursor-pointer">
                          <div tabIndex={0} className="m-1 flex">
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
                          </div>
                          <ul
                            tabIndex={0}
                            className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
                          >
                            <li>
                              <AlertDialog>
                                <AlertDialogTrigger>
                                  <span className="flex justify-evenly">
                                    <p>Delete</p>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth="1.5"
                                      stroke="currentColor"
                                      className="size-6"
                                      color="red"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                      />
                                    </svg>
                                  </span>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Are you absolutely sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will
                                      permanently delete your account and remove
                                      your data from our servers.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeletePost(post.id)}
                                    >
                                      Continue
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </li>
                            <li>
                              <span
                                onClick={() => handleDeletePost(post.id)}
                                className="flex justify-evenly"
                              >
                                <p>Edit</p>
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
                                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                  />
                                </svg>
                              </span>
                            </li>
                          </ul>
                        </div>
                      )}
                      <p className="my-4">{post.text}</p>
                      <div className="flex">
                        <p className="px-2">{post.Likes.length} Likes</p>
                        <p className="px-2">{post.Comments.length} Comments</p>
                      </div>

                      <span className="divider"></span>
                      <div className="flex justify-evenly">
                        <span
                          className="flex cursor-pointer"
                          onClick={() => handleLikePost(post.id)}
                        >
                          {post.likedByUser ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="blue"
                              className="size-6"
                            >
                              <path d="M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75A.75.75 0 0 1 15 2a2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23h-.777ZM2.331 10.727a11.969 11.969 0 0 0-.831 4.398 12 12 0 0 0 .52 3.507C2.28 19.482 3.105 20 3.994 20H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 0 1-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227Z" />
                            </svg>
                          ) : (
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
                                d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                              />
                            </svg>
                          )}

                          <p
                            className={`px-2 ${
                              post.likedByUser
                                ? "text-blue-700"
                                : "text-gray-500"
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
            </Linkify>{" "}
          </InfiniteScroll>
        )}
        <div className="fixed w-100 h-100 bg-white right-4 bottom-0 z-0 p-4 rounded-lg shadow-lg dark:bg-gray-900 hidden">
          <Chat />
        </div>
      </div>
      <div className="fixed top-16 right-4 w-100 h-svh p-4 overflow-auto">
        <h2 className="text-2xl text-gray-500 font-bold mb-4">
          Upcoming Events
        </h2>
        {eventState.events.map((event) => {
          const date = new Date(event.start);
          const day = date.getDate();
          const month = date
            .toLocaleString("default", { month: "short" })
            .toUpperCase(); // e.g., "Apr" -> "APR"

          const startTime = new Date(event.start).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });
          const endTime = new Date(event.end).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });

          return (
            <div className="card bg-base-100 border border-primary w-full shadow-sm mb-2">
              <div className="flex flex-row card-body text-primary gap-4">
                <div className="flex flex-col p-2 bg-primary h-24 w-24 items-center justify-center rounded-box text-neutral-content">
                  <span className="font-mono text-5xl leading-none">{day}</span>
                  <span className="text-sm font-bold">{month}</span>
                </div>
                <div className="flex flex-col justify-center gap-2">
                  <h2 className="card-title">{event.title.toUpperCase()}</h2>
                  <p className="text-lg">Start: {startTime}</p>
                  <p className="text-lg">End: {endTime}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
