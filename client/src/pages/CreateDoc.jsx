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
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

  const archiveDoc = useMutation({
    mutationFn: async (id) => {
      await axios.post(
        `${API_URL}/archive/${id}`,
        { type: "Document" },
        { withCredentials: true }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doc"] });
      toast.success("Document archived successfully");
    },
  });

  return (
    <div className="dark:bg-gray-800 p-4">
      <PageLoc currentPage="Create Document" />
      <div className="flex gap-4 mb-4">
        <Dialog>
          <DialogTrigger asChild>
            <div className="h-70 w-50 p-4 bg-quaternary rounded-lg shadow">
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
                className="flex flex-col relative justify-between h-70 w-50 p-4 bg-accent rounded-lg shadow"
              >
                <div className="dropdown dropdown-end absolute top-4 right-4 cursor-pointer z-10">
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
                    className="dropdown-content menu bg-base-100 rounded-box z-1 w-30 p-2 shadow-sm  border border-gray-300"
                  >
                    <li>
                      <AlertDialog>
                        <AlertDialogTrigger>
                          <span className="flex justify-evenly gap-4">
                            <p>Archive</p>
                          </span>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete your post and remove the data
                              from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => archiveDoc.mutate(document.id)}
                              className="bg-red-400 hover:bg-red-600 text-white"
                            >
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </li>
                  </ul>
                </div>
                <div
                  onClick={() => navigate(`/editor/${document.id}`)}
                  className="flex flex-col justify-between  h-full"
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
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
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
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        className="w-100 p-4 bg-tertiary"
                      >
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
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
