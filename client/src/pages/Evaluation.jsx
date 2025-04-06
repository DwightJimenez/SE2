import React, { useState, useEffect } from "react";
import axios from "axios";
import PageLoc from "../components/PageLoc";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";

const fetchForm = async () => {
  const response = await axios.get("http://localhost:4001/evaluation", {
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

  return (
    <div className="flex flex-col items-center">
      <PageLoc currentPage="Evaluate" />
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
              className="h-80 w-60 p-4 bg-accent rounded-lg shadow"
              onClick={() => navigate(`/evaluation/evaluate/${form.id}`)}
            >
              <h3 className="font-bold">{form.title}</h3>
              <p>{form.description}</p>
            </div>
          ))}
        </div>
      )}
      
    </div>
  );
};

export default EvaluationList;
