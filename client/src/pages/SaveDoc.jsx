import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const SaveDoc = () => {
  const [docName, setDocName] = useState("");

  const create = async () => {
    if (!docName.trim()) return alert("Document name cannot be empty.");
    try {
      await axios.post(
        `${API_URL}/editor/file/create`,
        { name: docName },
        { withCredentials: true }
      );
      setDocName("");
      alert("Document created successfully!");
    } catch (error) {
      console.error("Error creating document:", error);
      alert("Failed to create document.");
    }
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
      <Button onClick={create}>Create</Button>
    </div>
  );
};

export default SaveDoc;
