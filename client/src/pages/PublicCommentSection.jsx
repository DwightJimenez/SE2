import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Linkify from "react-linkify";
import { useState } from "react";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import { useContext } from "react";
const API_URL = import.meta.env.VITE_API_URL;

const fetchComments = async (PostId) => {
  const response = await axios.get(`${API_URL}/comments/${PostId}`);
  return response.data;
};

const CommentsSection = ({ PostId }) => {
  const { authState } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const deleteCommentMutation = useMutation({
    mutationFn: async ({ commentId }) => {
      await axios.delete(`${API_URL}/comments/delete/${commentId}`, {
        withCredentials: true,
      });
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
      const response = await axios.post(`${API_URL}/comments`, newComment, {
        withCredentials: true,
      });
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
              
            </div>
          </Linkify>
        ))}
    </div>
  );
};

export default CommentsSection;
