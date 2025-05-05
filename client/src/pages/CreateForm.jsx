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
      <PageLoc currentPage="Create Form" />
      <div className="flex gap-4 mb-4">
        <Link to="/evaluation/add">
          <div className="h-80 w-60 p-4 bg-accent rounded-lg shadow">
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
                className="h-80 w-60 p-4 bg-accent rounded-lg shadow"
                onClick={() => navigate(`/evaluation/${evaluation.id}`)}
              >
                <h3 className="font-bold">{evaluation.title}</h3>
                <p>{evaluation.description}</p>
                <div className="mt-4 text-xs text-gray-500">
                  <p>Created: {formatDate(evaluation.createdAt)}</p>
                  {evaluation.updatedAt && (
                    <p>Updated: {formatDate(evaluation.updatedAt)}</p>
                  )}
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
