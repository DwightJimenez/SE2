import React, { useState } from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CreatePost from "./CreatePost";
import PostButton from "../components/PostButton";
import Linkify from "react-linkify";

const fetchPosts = async () => {
  const response = await axios.get("http://localhost:4001/posts");
  return response.data;
};

const fetchComments = async (PostId) => {
  const response = await axios.get(`http://localhost:4001/comments/${PostId}`);
  return response.data;
};

const Home = () => {
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

  if (isLoading) return <p>Loading posts...</p>;
  if (isError) return <p className="text-red-500">Error loading posts.</p>;

  return (
    <div className="flex flex-col space-y-4 p-4">
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
        <Linkify componentDecorator={(href, text, key) => (
          <a
            href={href}
            key={key}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            {text}
          </a>)}>
          <div className="space-y-4 max-w-200">
            {posts.map((post) => (
              <div key={post.id} className="card bg-base-100 shadow-sm p-4">
                <div
                  className="cursor-pointer"
                  onClick={() =>
                    setExpandedPost(expandedPost === post.id ? null : post.id)
                  }
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">@{post.username}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-2">{post.text}</p>
                </div>

                {expandedPost === post.id && (
                  <CommentsSection PostId={post.id} />
                )}
              </div>
            ))}
          </div>
        </Linkify>
      )}
    </div>
  );
};

// ✅ Comments Section with Comment Posting
const CommentsSection = ({ PostId }) => {
  const queryClient = useQueryClient();

  const {
    data: comments,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["comments", PostId],
    queryFn: () => fetchComments(PostId),
  });

  const addCommentMutation = useMutation({
    mutationFn: async (newComment) => {
      const response = await axios.post(
        "http://localhost:4001/comments",
        newComment,
        {
          headers: { accessToken: sessionStorage.getItem("accessToken") },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", PostId]);
    },
  });

  const [commentText, setCommentText] = useState("");

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = { PostId, commentBody: commentText };

    console.log("Submitting comment:", newComment); // ✅ Check console

    addCommentMutation.mutate(newComment);
    setCommentText(""); // Clear input after submitting
  };

  return (
    <div className="mt-3 p-3 bg-gray-100 rounded-md">
      <h3 className="font-bold mb-2">Comments</h3>

      {/* Keep the section visible and show loading indicator */}
      {isLoading && (
        <p className="text-sm text-gray-500">Loading comments...</p>
      )}
      {isError && <p className="text-red-500">Error loading comments.</p>}

      {!isLoading && comments?.length === 0 && <p>No comments yet.</p>}

      {!isLoading &&
        comments?.map((comment) => (
          <div key={comment.id} className="p-2 border-b">
            <p className="text-sm font-semibold">@{comment.username}</p>
            <p className="text-sm">{comment.commentBody}</p>
            <span className="text-xs text-gray-500">
              {new Date(comment.createdAt).toLocaleString()}
            </span>
          </div>
        ))}

      {/* Keep comment input always visible */}
      <form
        onSubmit={handleCommentSubmit}
        className="mt-3 flex items-center space-x-2"
      >
        <input
          type="text"
          placeholder="Add a comment..."
          className="input input-primary flex-grow"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          disabled={addCommentMutation.isLoading}
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={addCommentMutation.isLoading}
        >
          {addCommentMutation.isLoading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default Home;
