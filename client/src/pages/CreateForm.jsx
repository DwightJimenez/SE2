import React from "react";
import PageLoc from "../components/PageLoc";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
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

const fetchForm = async () => {
  const response = await axios.get(`${API_URL}/evaluation`, {
    withCredentials: true,
  });
  return response.data;
};

const CreateForm = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: forms = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["form"],
    queryFn: fetchForm,
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

  const archiveForm = useMutation({
    mutationFn: async (id) => {
      await axios.post(
        `${API_URL}/archive/form/${id}`,
        { type: "Form" },
        { withCredentials: true }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["form"] });
      toast.success("Form archived successfully");
    },
  });

  return (
    <div className="dark:bg-gray-800 p-4">
      <PageLoc currentPage="Create Evaluation Form" />
      <div className="flex gap-4 mb-4">
        <Link to="/evaluation/add">
          <div className="h-60 min-w-40 p-4 bg-tertiary rounded-lg shadow">
            <h1 className="text-white">+</h1>
          </div>
        </Link>

        {isLoading ? (
          <p>Loading evaluations...</p>
        ) : isError ? (
          <p>Error loading evaluations.</p>
        ) : forms.length === 0 ? (
          <p>No evaluations found.</p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {forms.map((evaluation) => (
              <div
                key={evaluation.id}
                className="flex flex-col relative justify-between h-60 w-40 p-4 bg-white border border-orange-700 rounded-lg shadow"
              >
                <div className="dropdown dropdown-end absolute top-4 right-4 cursor-pointer z-10">
                  <div tabIndex={0} className="m-1 flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6 text-orange-700"
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
                    className="dropdown-content menu bg-base-100 rounded-box z-1 w-30 p-2 shadow-sm  border border-gray-300 dark:text-white"
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
                              onClick={() => archiveForm.mutate(evaluation.id)}
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
                  onClick={() => navigate(`/evaluation/${evaluation.id}`)}
                  className="flex flex-col justify-between  h-full"
                >
                  {" "}
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-16 text-orange-700"
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
                          <h3 className="font-bold text-orange-700 text-xl truncate">
                            {evaluation.title}
                          </h3>
                          <p className="text-orange-700 truncate">
                            {evaluation.description}
                          </p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        className="w-100 p-4 bg-tertiary border border-orange-700"
                      >
                        <div className="flex flex-col w-full">
                          <h3 className="font-bold text-orange-700 text-xl truncate">
                            {evaluation.title}
                          </h3>
                          <p className="text-orange-700 truncate">
                            {evaluation.description}
                          </p>
                          <div className="justify-end mt-4 text-xs text-gray-500">
                            <p>Created: {formatDate(evaluation.createdAt)}</p>
                            {evaluation.updatedAt && (
                              <p>Updated: {formatDate(evaluation.updatedAt)}</p>
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

export default CreateForm;
