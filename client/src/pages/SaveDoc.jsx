import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;

const SaveDoc = () => {
  const [docName, setDocName] = useState("");
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!docName.trim()) throw new Error("Document name cannot be empty.");
      await axios.post(
        `${API_URL}/editor/file/create`,
        { name: docName },
        { withCredentials: true }
      );
    },
    onSuccess: () => {
      setDocName("");
      toast("Document created successfully!");
      // Invalidate or refetch the list of documents
      queryClient.invalidateQueries(["documents"]);
    },
    onError: (error) => {
      console.error("Error creating document:", error);
      alert("Failed to create document.");
    },
  });

  const handleCreate = () => {
    createMutation.mutate();
  };
  return (
    <div className="flex flex-col gap-4">
      <input
        type="text"
        className="border p-2"
        placeholder="Document Name"
        value={docName}
        onChange={(e) => setDocName(e.target.value)}
      />
      <Button onClick={handleCreate} disabled={createMutation.isLoading}>
        {createMutation.isLoading ? "Creating..." : "Create"}
      </Button>
    </div>
  );
};

export default SaveDoc;
