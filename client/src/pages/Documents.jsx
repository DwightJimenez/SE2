import React from "react";
import PageLoc from "../components/PageLoc";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const API_URL = import.meta.env.VITE_API_URL;

const fetchDocuments = async () => {
  const response = await axios.get(`${API_URL}/editor/file`, {
    withCredentials: true,
  });
  return response.data;
};

const Documents = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    data: documents = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["documents"],
    queryFn: fetchDocuments,
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

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Failed to load documents.</div>;

  return (
    <div className="p-4 ">
      <PageLoc currentPage="Documents" />
      <div className="flex gap-4 mb-4">
        {isLoading ? (
          <p>Loading documents...</p>
        ) : isError ? (
          <p>Error loading documents.</p>
        ) : documents.length === 0 ? (
          <p>No documents found.</p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {documents.map((document) => (
              <div
                key={document.id}
                className="flex flex-col justify-between h-60 w-40 p-4 bg-white rounded-lg shadow-2xl border border-primary "
                onClick={() => navigate(`/view-editor/${document.id}`)}
              >
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-16 text-quaternary mb-4 "
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                    />
                  </svg>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex flex-col w-full">
                        <h3 className="font-bold text-primary text-md truncate">
                          {document.name}
                        </h3>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="w-100 p-4 border border-quaternary bg-white"
                    >
                      <div className="flex flex-col w-full">
                        <h3 className="font-bold text-quaternary text-xl">
                          {document.name}
                        </h3>
                        <div className="justify-end mt-4 text-xs text-quaternary">
                          <p>Created: {formatDate(document.createdAt)}</p>
                          {document.updatedAt && (
                            <p>Updated: {formatDate(document.updatedAt)}</p>
                          )}
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Documents;
