import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import PageLoc from "../components/PageLoc";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
      toast.success("Document restored successfully");
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
      toast.success("Document deleted successfully");
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
      <div className="flex  border border-gray-300 bg-white shadow-2xl rounded-box dark:bg-black dark:border-gray-600">
        <table className="table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {archiveDoc.map((doc) => (
              <tr key={doc.id} className="dark:text-white">
                <td>{doc.type}</td>
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
                <td className="flex gap-2">
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <span className="flex justify-evenly gap-4">
                        <Button className="bg-accent">
                          Restore
                        </Button>
                      </span>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you sure you want to restore?
                        </AlertDialogTitle>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => restoreArchive(doc.id)}
                          className="btn bg-accent"
                        >
                          Restore
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <AlertDialog>
                    <AlertDialogTrigger>
                      <span className="flex justify-evenly gap-4">
                        <Button className="bg-red-500 hover:bg-red-700">
                          Delete
                        </Button>
                      </span>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you sure you want to delete?
                        </AlertDialogTitle>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(doc.id)}
                          className="bg-red-500 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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
