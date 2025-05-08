import React from "react";
import PageLoc from "../components/PageLoc";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
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

  return (
    <div className="dark:bg-gray-800 p-4">
      <PageLoc currentPage="Create Evaluation Form" />
      <div className="flex gap-4 mb-4">
        <Link to="/evaluation/add">
          <div className="h-70 w-50 p-4 bg-accent rounded-lg shadow">
            <h1>+</h1>
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
                className="flex flex-col justify-between h-70 w-50 p-4 bg-accent rounded-lg shadow"
                onClick={() => navigate(`/evaluation/${evaluation.id}`)}
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
                  <h3 className="font-bold text-white text-xl">{evaluation.title}</h3>
                  <p>{evaluation.description}</p>
                  <div className="justify-end mt-4 text-xs text-gray-500">
                    <p>Created: {formatDate(evaluation.createdAt)}</p>
                    {evaluation.updatedAt && (
                      <p>Updated: {formatDate(evaluation.updatedAt)}</p>
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

export default CreateForm;
