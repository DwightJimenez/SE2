import React, { useEffect } from "react";
import PageLoc from "../components/PageLoc";
import SaveDoc from "./SaveDoc";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
const API_URL = import.meta.env.VITE_API_URL;

const fetchDoc = async () => {
  const response = await axios.get(`${API_URL}/editor/file`, {
    withCredentials: true,
  });
  return response.data;
};
const CreateDoc = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: docs = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["doc"],
    queryFn: fetchDoc,
    staleTime: 300000, // 5 minutes
  });

  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true, // 12-hour format with AM/PM
    };
    return new Date(date).toLocaleString("en-US", options);
  };
  return (
    <div className="dark:bg-gray-800 p-4">
      <PageLoc currentPage="Create Document" />
      <div className="flex gap-4 mb-4">
        <Dialog>
          <DialogTrigger asChild>
            <div className="h-70 w-50 p-4 bg-accent rounded-lg shadow">
              <h1 className="text-primary">+</h1>
            </div>
          </DialogTrigger>
          <DialogContent className="w-auto">
            <DialogHeader>Create Document</DialogHeader>
            <SaveDoc />
          </DialogContent>
        </Dialog>

        {isLoading ? (
          <p>Loading documents...</p>
        ) : isError ? (
          <p>Error loading documents.</p>
        ) : docs.length === 0 ? (
          <p>No documents found.</p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {docs.map((document) => (
              <div
                key={document.id}
                className="flex flex-col justify-between h-70 w-50 p-4 bg-accent rounded-lg shadow"
                onClick={() => navigate(`/editor/${document.id}`)}
              >
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-16 text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                    />
                  </svg>
                </div>
                <div className="flex flex-col w-full">
                  <h3 className="font-bold text-white text-xl">
                    {document.name}
                  </h3>
                  <div className="justify-end mt-4 text-xs text-gray-800">
                    <p>Created: {formatDate(document.createdAt)}</p>
                    {document.updatedAt && (
                      <p>Updated: {formatDate(document.updatedAt)}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateDoc;
