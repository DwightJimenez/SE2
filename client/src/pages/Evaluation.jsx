import React, { useState, useEffect } from "react";
import axios from "axios";
import PageLoc from "../components/PageLoc";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
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

const EvaluationList = ({ userId, questionId }) => {
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questions, setQuestions] = useState([]);

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
    <div className="p-4">
      <PageLoc currentPage="Evaluate" />
      <div className="flex gap-4 mb-4">
        {isLoading ? (
          <p>Loading evaluations...</p>
        ) : isError ? (
          <p>Error loading evaluations.</p>
        ) : forms.length === 0 ? (
          <p>No evaluations found.</p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {forms.map((form) => (
              <div
                key={form.id}
                className="flex flex-col justify-between h-60 w-40 p-4 rounded-lg shadow-2xl relative  border border-tertiary dark:bg-tertiary dark:border-orange-700"
                onClick={() => navigate(`/evaluation/evaluate/${form.id}`)}
              >
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-14 text-orange-500 dark:text-white"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex flex-col w-full">
                        <h3 className="font-bold text-md text-orange-700 truncate">
                          {form.title}
                        </h3>
                        <p className="text-orange-700 text-sm truncate max-w-xs">
                          {form.description}
                        </p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="w-100 p-4 bg-tertiary"
                    >
                      <div className="flex flex-col w-full">
                        <h3 className="font-bold text-xl text-orange-700">
                          {form.title}
                        </h3>
                        <p className="text-orange-700">{form.description}</p>
                        <div className="justify-end mt-4 text-xs text-orange-700">
                          <p>Created: {formatDate(form.createdAt)}</p>
                          {form.updatedAt && (
                            <p>Updated: {formatDate(form.updatedAt)}</p>
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

export default EvaluationList;
