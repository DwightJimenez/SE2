import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageLoc from "../components/PageLoc";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AuthContext } from "../helpers/AuthContext";
import { useContext } from "react";
const API_URL = import.meta.env.VITE_API_URL;

const Question = ({
  index,
  text,
  setRating,
  rating,
  userId,
  currentRating,
}) => {
  const hasRated = rating?.some((r) => r.UserId === userId);
  const userSavedRating = rating?.find((r) => r.UserId === userId)?.score || 0;

  // Use saved rating if already rated, otherwise show what's selected
  const effectiveRating = hasRated ? userSavedRating : currentRating;

  return (
    <div className="flex flex-col max-w-200 mb-4 bg-gray-100 dark:bg-gray-900 p-4 rounded-lg shadow-2xl">
      <div className="flex justify-between">
        <input
          type="text"
          value={text}
          className="p-2 rounded w-full"
          readOnly
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
              name={`rating-${index}`}
              className={`mask mask-star-2 ${
                effectiveRating >= value ? "bg-orange-400" : "bg-gray-600"
              }`}
              aria-label={`${value} star`}
              checked={effectiveRating === value}
              onChange={() => setRating(index, value)}
              disabled={hasRated}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const fetchQuestion = async (id) => {
  const response = await axios.get(
    `${API_URL}/evaluation/byId/${id}`,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

const fetchUserRatings = async (questionId) => {
  const response = await axios.get(
    `${API_URL}/rating/user/${questionId}`,
    { withCredentials: true }
  );

  return response.data; // Expecting { ratings: [{ questionId, score }] }
};

const UserRating = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);

 

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
      console.log(question.Ratings, "userRatings"); // Debugging line to check the userRatings
      setTitle(question.title || "");

      setDescription(question.description || "");

      const fetchedQuestions = question.Questions || [];
      setQuestions(fetchedQuestions);

      // Load ratings from localStorage
      const storedRatings = sessionStorage.getItem(`ratings-${id}`);
      let defaultRatings = storedRatings ? JSON.parse(storedRatings) : {};

      // If userRatings exist, update defaultRatings with API values
      if (userRatings && userRatings.ratings) {
        userRatings.ratings.forEach(({ questionId, score }) => {
          const questionIndex = fetchedQuestions.findIndex(
            (q) => q.id === questionId
          );
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
      sessionStorage.setItem(`ratings-${id}`, JSON.stringify(updatedRatings));
      return updatedRatings;
    });
  };

  const submitRatings = async () => {
    try {
      const response = await axios.post(
        "${API_URL}/rating/submit",
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
      <PageLoc
        currentPage="Evaluate Question"
        showBack={true}
        backLink="/evaluation"
      />

      <div className="p-4 my-4 max-w-200 bg-accent dark:bg-gray-900 rounded-lg shadow-2xl">
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
          rating={q.Ratings} // from DB
          currentRating={ratings[index] || 0} // from session or selected
          userId={authState.id} // your current user ID (replace later)
        />
      ))}

      {questions.length > 0 &&
        !questions.every((q) =>
          q.Ratings?.some((r) => r.UserId === authState.id)
        ) && (
          <button
            onClick={submitRatings}
            className="bg-blue-500 text-white p-2 mt-4 rounded"
          >
            Submit Ratings
          </button>
        )}
    </div>
  );
};

export default UserRating;
