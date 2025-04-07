import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageLoc from "../components/PageLoc";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";

const Question = ({ index, text, setRating, rating }) => {
  return (
    <div className="flex flex-col max-w-200 mb-4 bg-gray-100 dark:bg-gray-900 p-4 rounded-lg shadow-2xl">
      <div className="flex justify-between">
        <input
          type="text"
          value={text}
          placeholder="Question"
          className="p-2 rounded w-full"
          readOnly // Prevent editing if it's just for display
        />
      </div>
      <div className="flex flex-col justify-center">
        <div className="flex justify-center gap-15 my-4">
          {[1, 2, 3, 4, 5].map((num) => (
            <p key={num}>{num}</p>
          ))}
        </div>
        <div className="flex justify-center rating rating-xl gap-10">
          {[1, 2, 3, 4, 5].map((value) => (
            <input
              key={value}
              type="radio"
              name={`rating-${index}`} // Unique name per question
              className={`mask mask-star-2 ${
                rating >= value ? "bg-orange-400" : "bg-gray-600"
              }`}
              aria-label={`${value} star`}
              checked={rating === value}
              onChange={() => setRating(index, value)} // Ensure the correct question is updated
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const fetchQuestion = async (id) => {
  const response = await axios.get(
    `http://localhost:4001/evaluation/byId/${id}`,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

const fetchUserRatings = async (formId) => {
  const response = await axios.get(
    `http://localhost:4001/rating/user/${formId}`,
    { withCredentials: true }
  );
  return response.data; // Expecting { ratings: [{ questionId, score }] }
};

const UserRating = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: question,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["question", id],
    queryFn: () => fetchQuestion(id),
    enabled: !!id,
  });

  const { data: userRatings } = useQuery({
    queryKey: ["userRatings", id], // 'id' should be the questionId
    queryFn: () => fetchUserRatings(id),
    enabled: !!id,
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    if (question) {
      setTitle(question.title || "");
      setDescription(question.description || "");
  
      const fetchedQuestions = question.Questions || [];
      setQuestions(fetchedQuestions);
  
      // Load ratings from localStorage
      const storedRatings = localStorage.getItem(`ratings-${id}`);
      let defaultRatings = storedRatings ? JSON.parse(storedRatings) : {};
  
      // If userRatings exist, update defaultRatings with API values
      if (userRatings && userRatings.ratings) {
        userRatings.ratings.forEach(({ questionId, score }) => {
          const questionIndex = fetchedQuestions.findIndex((q) => q.id === questionId);
          if (questionIndex !== -1) {
            defaultRatings[questionIndex] = score;
          }
        });
      }
  
      setRatings(defaultRatings);
    }
  }, [question, userRatings]); 
  
  

 const setRating = (index, value) => {
  setRatings((prev) => {
    const updatedRatings = { ...prev, [index]: value };
    localStorage.setItem(`ratings-${id}`, JSON.stringify(updatedRatings));
    return updatedRatings;
  });
};


  const submitRatings = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4001/rating/submit",
        {
          formId: id,
          ratings: Object.entries(ratings).map(([index, score]) => ({
            questionId: questions[index].id,
            score,
          })),
        },
        { withCredentials: true }
      );
      alert("Ratings submitted successfully!");
      navigate("/evaluation");
    } catch (error) {
      alert("Failed to submit ratings.");
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading form.</p>;

  return (
    <div className="dark:bg-gray-800 p-4">
      <PageLoc currentPage="Evaluate Question"  showBack={true} backLink="/evaluation"/>
      
      <div className="p-4 my-4 max-w-200 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-2xl">
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
          setRating={setRating}
          rating={ratings[index]}
        />
      ))}
      <button
        onClick={submitRatings}
        className="bg-blue-500 text-white p-2 mt-4 rounded"
      >
        Submit Ratings
      </button>
    </div>
  );
};

export default UserRating;
