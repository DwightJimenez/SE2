import React, { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import PostButton from "../components/PostButton";
import Linkify from "react-linkify";
import moment from "moment";
import CommentsSection from "./CommentsSection";
import { AuthContext } from "../helpers/AuthContext";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

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
    `${API_URL}/posts/public/?page=${pageParam}&limit=5`,
    {
      withCredentials: true,
    }
  );
  return {
    ...res.data,
    nextPage: res.data.posts.length === 5 ? pageParam + 1 : undefined,
  };
};

const PublicPost = () => {
  const { authState, eventState } = useContext(AuthContext);

  const bottomRef = useRef(null);

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
  const [eventData, setEventData] = useState([]);

  const deletePostMutation = useMutation({
    mutationFn: async (postId) => {
      await axios.delete(`${API_URL}/posts/delete/${postId}`, {
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
        `${API_URL}/posts/like/${postId}`,
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

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_URL}/events`);
        const now = moment(); // current local time
        const formattedEvents = response.data
          .filter((event) =>
            moment.utc(event.start).local().isSameOrAfter(now, "day")
          ) // keep today and future
          .map((event) => ({
            id: event.id,
            title: event.title,
            start: moment.utc(event.start).local().format("YYYY-MM-DD HH:mm"),
            end: moment.utc(event.end).local().format("YYYY-MM-DD HH:mm"),
          }));
        setEventData(formattedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY); // Capture scroll position
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [eventData]);

  if (isError) return <p className="text-red-500">Error loading posts.</p>;

  return (
    <div className="flex-grow ml-0 mt-16  bg-white dark:bg-gray-800 sm:ml-64 mx-sm:w-screen">
      <div className="flex flex-col space-y-4 p-4 bg-white dark:bg-gray-800">
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
                        <div className="dropdown dropdown-end absolute top-4 right-4 cursor-pointer">
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
                        </div>
                      )}
                      <p className="my-4">{post.text}</p>
                      <div className="flex">
                        <p className="px-2">{post.Likes.length} Likes</p>
                        <p className="px-2">{post.Comments.length} Comments</p>
                      </div>

                      <span className="divider"></span>
                      <div className="flex justify-evenly">
                        <Link to="/login">
                          <span className="flex cursor-pointer">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="size-6 text-gray-500"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                              />
                            </svg>

                            <p className="px-2 text-gray-500">Like</p>
                          </span>
                        </Link>

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
      </div>

      <div className="fixed top-16 right-4 w-full sm:w-[350px] md:w-[400px] h-[70vh] p-4 bg-white">
        <h2 className="text-2xl text-gray-700 font-bold mb-4 sticky top-0 bg-white z-10 p-4">
          Upcoming Events
        </h2>
        <div className="flex flex-col space-y-4 overflow-y-auto h-[calc(100%-64px)]">
          {eventData.map((event, index) => {
            const date = new Date(event.start);
            const day = date.getDate();
            const month = date
              .toLocaleString("default", { month: "short" })
              .toUpperCase();
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
              <motion.div
                key={index}
                className="flex card bg-base-100 border border-primary w-full mb-2 p-0"
                initial={{ opacity: 0, y: 20 }} // Start offscreen with opacity 0
                whileInView={{ opacity: 1, y: 0 }} // Animate to visible when in view
                transition={{ duration: 0.5, delay: index * 0.1 }} // Stagger the animation with a delay
                viewport={{ once: false, amount: 0.5 }} // Trigger animation when 50% of the element is in the viewport
              >
                <div className="flex flex-row card-body text-primary gap-4 p-3">
                  <div className="flex flex-col p-2 bg-primary max-h-20 max-w-20 min-w-20 items-center justify-center rounded-box text-neutral-content">
                    <span className="font-mono text-4xl leading-none">
                      {day}
                    </span>
                    <span className="text-sm font-bold">{month}</span>
                  </div>
                  <div className="flex flex-col justify-center gap-1 truncate ">
                    <h2 className="card-title">{event.title.toUpperCase()}</h2>
                    <p className="text-md flex gap-2">
                      <div className="badge badge-secondary p-2 text-white">
                        Start:{" "}
                      </div>
                      {startTime}
                    </p>
                    <p className="text-md flex gap-4">
                      <div className="badge badge-secondary p-2 text-white">
                        End:{" "}
                      </div>
                      {endTime}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
};

export default PublicPost;
