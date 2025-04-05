import React, { useState } from "react";
import PageLoc from "../components/PageLoc";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";

const fetchForm = async () => {
  const response = await axios.get("http://localhost:4001/evaluation", {
    withCredentials: true,
  });
  return response.data;
};



const Evaluation = () => {
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
    <div className="dark:bg-gray-800 p-4">
      <PageLoc currentPage="Evaluation" />
      <Link to="/evaluation/evaluate">evaluate</Link>
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
                onClick={()=> navigate(`/evaluation/${evaluation.id}`)}
              >
                <h3 className="font-bold">{evaluation.title}</h3>
                <p>{evaluation.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

     
    </div>
  );
};

export default Evaluation;
