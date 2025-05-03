import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageLoc from "../components/PageLoc";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import BarChart from "../components/BarChart";

const Question = ({
  index,
  text,
  updateQuestion,
  removeQuestion,
  showRemove = false,
}) => (
  <div className="flex flex-col mb-4 bg-gray-100 dark:bg-gray-900 p-4 rounded-lg shadow-2xl">
    <div className="flex justify-between">
      <input
        type="text"
        value={text}
        placeholder="Question"
        onChange={(e) => updateQuestion(index, e.target.value)}
        className="p-2 rounded w-full"
      />
    </div>

    {showRemove && (
      <>
        <div className="divider"></div>
        <button
          onClick={() => removeQuestion(index)}
          className="text-red-500 mt-2"
        >
          Remove
        </button>
      </>
    )}
  </div>
);

const calculatePercentages = (scoreCount) => {
  const totalResponses = Object.values(scoreCount).reduce(
    (sum, count) => sum + count,
    0
  ); // Total responses

  // Calculate percentages for each score (1 to 5)
  const percentages = Object.keys(scoreCount).map((score) => {
    const count = scoreCount[score];
    return ((count / totalResponses) * 100).toFixed(2); // Percentage with 2 decimal places
  });

  return percentages;
};

const fetchFormById = async (id) => {
  const response = await axios.get(
    `http://localhost:4001/evaluation/byId/${id}`,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

const EditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [evaluationScores, setEvaluationScores] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [average, setAverage] = useState([]);

  const {
    data: form,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["form", id],
    queryFn: () => fetchFormById(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (form) {
      setTitle(form.title || "");
      setDescription(form.description || "");
      setQuestions(form.Questions || []);

      const scores = form.Questions.map((question) => {
        return calculatePercentages(question.scoreCount);
      });
      const avgScores = form.Questions.map((question) => {
        const totalScore = question.Ratings.reduce(
          (sum, rating) => sum + rating.score,
          0
        );
        const avgScore = totalScore / question.Ratings.length || 0;
        return parseFloat(avgScore.toFixed(2));
      });
      setAverage(avgScores);
      setEvaluationScores(scores);
    }
  }, [form]);

  const updateFormMutation = useMutation({
    mutationFn: async () => {
      return axios.put(
        `http://localhost:4001/evaluation/update/${id}`,
        { title, description, questions },
        { withCredentials: true }
      );
    },
    onSuccess: () => {
      alert("Form updated successfully!");
      navigate("/evaluation"); // Redirect after update
    },
    onError: () => {
      alert("Failed to update form.");
    },
  });

  const addQuestion = () => {
    setQuestions([...questions, { text: "" }]);
  };

  const updateQuestion = (index, value) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, text: value } : q))
    );
  };

  const removeQuestion = (index) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const deleteFormMutation = useMutation({
    mutationFn: async () => {
      await axios.delete(`http://localhost:4001/evaluation/delete/${id}`, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      alert("Form deleted successfully!");
      navigate("/create-form"); // Redirect after deletion
    },
    onError: () => {
      alert("Failed to delete form.");
    },
  });

  const deleteForm = () => {
    if (window.confirm("Are you sure you want to delete this form?")) {
      deleteFormMutation.mutate();
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading form.</p>;

  return (
    <div className="dark:bg-gray-800 p-4">
      <PageLoc
        currentPage="Edit Form"
        showBack={true}
        backLink="/create-form"
      />
      {/* name of each tab group should be unique */}

      <div className="tabs tabs-box tabs-md tabs-lift tabs-border gap-2">
        <label className="tab">
          <input type="radio" name="my_tabs_4" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-4 me-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
            />
          </svg>
          Questions
        </label>
        <div className="tab-content bg-base-100 border-base-300 p-6">
          <div className="p-4 bg-accent mb-4 dark:bg-gray-900 rounded-lg shadow">
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
              className="mt-2 w-full p-2 rounded focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {questions.map((q, index) => (
            <Question
              key={index}
              index={index}
              text={q.text}
              updateQuestion={updateQuestion}
              removeQuestion={removeQuestion}
              showRemove={true}
            />
          ))}

          <button
            onClick={addQuestion}
            className="bg-green-500 text-white p-2 mt-4 rounded"
          >
            Add Question
          </button>

          <button
            onClick={() => updateFormMutation.mutate()}
            className="bg-blue-500 text-white p-2 mt-4 rounded ml-2"
          >
            Update Form
          </button>
        </div>

        <label className="tab">
          <input type="radio" name="my_tabs_4" defaultChecked />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-4 me-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
            />
          </svg>
          Responses
        </label>
        <div className="tab-content bg-base-100 border-base-300 p-6">
          {questions.map((q, index) => (
            <>
              <Question key={index} index={index} text={q.text} />
              <BarChart
                title={`Average rating(${average[index]})`}
                labels={["1", "2", "3", "4", "5"]}
                scores={evaluationScores[index] || []}
                datasetLabel="Average Rating"
                maxScore={100}
                color="rgba(16, 185, 129) "
                borderColor="rgba(16, 185, 129, 1)"
              />
            </>
          ))}
        </div>

        <label className="tab">
          <input type="radio" name="my_tabs_4" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-4 me-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
          Settings
        </label>
        <div className="tab-content bg-base-100 border-base-300 p-6">
          <p className="text-red-600" onClick={deleteForm}>
            Delete
          </p>
        </div>
      </div>
    </div>
  );
};

export default EditForm;
