import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Linkify from "react-linkify"
import { useState } from "react";
import axios from "axios"


const fetchComments = async (PostId) => {
  const response = await axios.get(`http://localhost:4001/comments/${PostId}`);
  return response.data;
};

const CommentsSection = ({ PostId }) => {
  const auth = JSON.parse(sessionStorage.getItem("authState"));
  const queryClient = useQueryClient();

  const deleteCommentMutation = useMutation({
    mutationFn: async ({ commentId }) => {
      await axios.delete(`http://localhost:4001/comments/delete/${commentId}`, {withCredentials: true});
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["comments", variables.PostId]);
    },
  });

  const handleDeleteComment = (commentId, PostId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      deleteCommentMutation.mutate({ commentId, PostId });
    }
  };

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
        { withCredentials: true }
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
            <div key={comment.id} className="relative p-2 border-b">
              <p className="text-sm font-semibold">@{comment.username}</p>
              <p className="text-sm">{comment.commentBody}</p>
              <span className="text-xs text-gray-500">
                {new Date(comment.createdAt).toLocaleString()}
              </span>
              {auth.username === comment.username && (
                <span
                  className="absolute top-4 right-4 cursor-pointer"
                  onClick={() => handleDeleteComment(comment.id)}
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
          </Linkify>
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

export default CommentsSection;
