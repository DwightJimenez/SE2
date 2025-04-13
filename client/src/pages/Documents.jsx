import React from "react";
import PageLoc from "../components/PageLoc";
import AddDoc from "../components/AddDoc";
import AddDocument from "./AddDocument";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const fetchDocuments = async () => {
  const response = await axios.get("http://localhost:4001/api");
  return response.data.filter((doc) => !doc.isArchive);
};

const Documents = () => {
  const queryClient = useQueryClient();
  const {
    data: documents = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["documents"],
    queryFn: fetchDocuments,
  });

  const handleArchive = async (id) => {
    console.log("Archiving document with ID:", id); // Log ID
    try {
      const response = await axios.post(`http://localhost:4001/archive/${id}`, {}, { withCredentials: true });
      console.log(response); // Log the response
      alert("Document archived successfully");
      queryClient.invalidateQueries(["documents"]);
    } catch (error) {
      console.error("Failed to archive document", error);
      alert("Failed to archive document. Please try again.");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Failed to load documents.</div>;

  return (
    <div className="p-4 dark:bg-gray-800">
      <PageLoc currentPage="Documents" />
      <div className="relative">
        <AddDoc />
        <div
          className="dropdown menu w-160 h-100 rounded-box bg-base-100 shadow-sm "
          popover="auto"
          id="popover-1"
          style={{ positionAnchor: "--anchor-1" } /* as React.CSSProperties */}
        >
          <AddDocument />
        </div>
      </div>
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-white shadow-lg  border border-gray-300">
        <table className="table">
          <thead>
            <tr>
              <th>Version</th>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {documents
              .sort((a, b) => {
                if (a.name === b.name) {
                  return b.version - a.version;
                }
                return a.name.localeCompare(b.name);
              })
              .map((doc) => (
                <tr key={doc.id}>
                  <td>{doc.version}</td>
                  <td>
                    <a
                      href={`http://localhost:4001/${doc.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "black" }}
                    >
                      {doc.name}
                    </a>
                  </td>
                  <td>
                    <button onClick={() => handleArchive(doc.id)}>
                      Archive
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

export default Documents;
