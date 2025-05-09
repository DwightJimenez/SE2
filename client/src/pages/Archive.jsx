import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import PageLoc from "../components/PageLoc";
const API_URL = import.meta.env.VITE_API_URL;

const fetchArchivedDocuments = async () => {
  const response = await axios.get(`${API_URL}/archive`, {
    withCredentials: true,
  });
  return response.data;
};

const Archive = () => {
  const queryClient = useQueryClient();
  // Use `useQuery` for fetching archived documents
  const {
    data: archiveDoc = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["archivedDocuments"],
    queryFn: fetchArchivedDocuments,
  });

  const restoreArchive = async (id) => {
    try {
      await axios.post(
        `${API_URL}/archive/restore/${id}`,
        {},
        { withCredentials: true }
      );
      alert("Document restored successfully");
      // Manually re-fetch the documents after restore
      queryClient.invalidateQueries(["archivedDocuments"]);
    } catch (error) {
      console.error("Failed to restore document", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/archive/delete/${id}`, {
        withCredentials: true,
      });
      alert("Document deleted successfully");
      // Manually re-fetch the documents after delete
      queryClient.invalidateQueries(["archivedDocuments"]);
    } catch (error) {
      console.error("Failed to delete document", error);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return (
      <p style={{ color: "red" }}>
        {error?.message || "Failed to fetch documents"}
      </p>
    );
  }

  return (
    <div className="p-4 dark:bg-gray-800">
      <PageLoc currentPage="Archive" />
      <div className="flex  border border-gray-300 bg-white shadow-2xl rounded-box">
        <table className="table">
          <thead>
            <tr>
              <th>Version</th>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {archiveDoc.map((doc) => (
              <tr key={doc.id}>
                <td>{doc.version}</td>
                <td>
                  <a
                    href={`${API_URL}/${doc.path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "black" }}
                  >
                    {doc.name}
                  </a>
                </td>
                <td>
                  <button
                    className="btn bg-accent"
                    onClick={() => restoreArchive(doc.id)}
                  >
                    Restore
                  </button>
                  <button className="btn"
                    onClick={() => handleDelete(doc.id)}
                    style={{ background: "red", color: "white" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Archive;
