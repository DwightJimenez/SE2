import React, { useState } from "react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
const API_URL = import.meta.env.VITE_API_URL;

const AddDocument = () => {
  const [file, setFile] = useState(null);
  const queryClient = useQueryClient();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(`${API_URL}/api/upload`, formData, {withCredentials:true});
      queryClient.invalidateQueries(["documents"]);
      alert("Upload successful!");
      setFile(null);
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  return (
    <div className="flex flex-col space-y-2 justify-evenly items-center p-4 h-full">
      <p className="text text-xl font-bold">Add Document</p>
      <input
        type="file"
        onChange={handleFileChange}
        className="file-input file-input-accent"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Upload
      </button>
    </div>
  );
};

export default AddDocument;
