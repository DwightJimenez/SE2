import React, {useEffect} from "react";
import PageLoc from "../components/PageLoc";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const fetchDoc = async () => {
  const response = await axios.get("http://localhost:4001/editor/file", {
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
        <Link to="/editor">
          <div className="h-80 w-60 p-4 bg-accent rounded-lg shadow">
            <h1>+</h1>
          </div>
        </Link>

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
                className="h-80 w-60 p-4 bg-accent rounded-lg shadow"
                onClick={() => navigate(`/editor/${document.id}`)}
              >
                <h3 className="font-bold">{document.name}</h3>
                <div className="mt-4 text-xs text-gray-500">
                  <p>Created: {formatDate(document.createdAt)}</p>
                  {document.updatedAt && (
                    <p>Updated: {formatDate(document.updatedAt)}</p>
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

export default CreateDoc;
