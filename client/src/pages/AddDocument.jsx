import React, { useState } from "react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

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
      await axios.post("http://localhost:4001/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          accessToken: sessionStorage.getItem("accessToken"),
        },
      });
      queryClient.invalidateQueries(["documents"]);
      alert("Upload successful!");
      setFile(null);
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  return (
    <div className="flex flex-col space-y-2 justify-center items-center p-4 h-full">
      <input type="file" onChange={handleFileChange} className="file-input file-input-accent" />
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
