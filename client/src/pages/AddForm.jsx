import React from "react";
import PageLoc from "../components/PageLoc";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const Question = ({ index, updateQuestion, removeQuestion }) => (
  <div className="flex flex-col mb-4 bg-gray-100 dark:bg-gray-900 p-4 rounded-lg shadow-2xl">
    <div className="flex justify-between">
      <input
        type="text"
        placeholder="Question"
        onChange={(e) => updateQuestion(index, e.target.value)}
        className="border p-2 rounded w-full"
      />
    </div>
    <button onClick={() => removeQuestion(index)} className="text-red-500 mt-2">
      Remove
    </button>
  </div>
);
const AddForm = () => {
  const [title, setTitle] = useState("Untitled Form");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);

  const saveFormMutation = useMutation({
    mutationFn: async () => {
      return axios.post(
        "http://localhost:4001/evaluation/save-form",
        {
          title,
          description,
          questions,
        },
        { withCredentials: true }
      );
    },
    onSuccess: () => {
      alert("Form saved successfully!");
      queryClient.invalidateQueries(["form"]);
    },
    onError: () => {
      alert("Failed to save form.");
    },
  });

  const addQuestion = () => {
    setQuestions([...questions, { text: "" }]);
  };

  const updateQuestion = (index, value, field) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, text: value } : q))
    );
  };

  const removeQuestion = (index) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };
  return (
    <div className="dark:bg-gray-800 p-4">
      <PageLoc currentPage="Add Form"  showBack={true} backLink="/create-form"/>
      <div className="p-4 bg-accent dark:bg-gray-900 rounded-lg shadow">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-3xl w-full p-2 rounded focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          value={description}
          placeholder="Form Description"
          onChange={(e) => setDescription(e.target.value)}
          className="mt-2 w-full p-2  rounded focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {questions.map((q, index) => (
        <Question
          key={index}
          index={index}
          updateQuestion={updateQuestion}
          removeQuestion={removeQuestion}
        />
      ))}
      <button
        onClick={addQuestion}
        className="bg-green-500 text-white p-2 mt-4 rounded"
      >
        Add Question
      </button>
      <button
        onClick={() => saveFormMutation.mutate()}
        className="bg-blue-500 text-white p-2 mt-4 rounded ml-2"
      >
        Save Form
      </button>
    </div>
  );
};

export default AddForm;
