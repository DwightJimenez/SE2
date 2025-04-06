const express = require("express");
const router = express.Router();
const { Rating, Question} = require("../models");
const {validateToken } = require("../middlewares/AuthMiddleware");

// Submit a rating
router.post("/submit", validateToken, async (req, res) => {
  try {
    const { formId, ratings } = req.body;
    const userId = req.user.id;

    for (const { questionId, score } of ratings) {
      await Rating.create({ FormId: formId, QuestionId: questionId, UserId: userId, score });
    }

    res.status(200).json({ message: "Ratings submitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});

router.get("/average/answers/:formId", validateToken, async (req, res) => {
  try {
    const { formId } = req.params;

    // Find all the ratings based on the formId (via questions that belong to the form)
    const ratings = await Rating.findAll({
      attributes: ["QuestionId", "score"],
      include: {
        model: Question,
        where: { FormId: formId },  // Ensure we are working with the correct form
        attributes: [],  // Don't return Question data
      },
    });

    if (!ratings || ratings.length === 0) {
      return res.status(404).json({ error: "No ratings found for this form." });
    }

    // Initialize an object to track scores per question
    const scoreSum = {};
    const scoreCount = {};

    // Aggregate the ratings per question
    ratings.forEach((rating) => {
      const questionId = rating.QuestionId;
      if (!scoreSum[questionId]) {
        scoreSum[questionId] = 0;
        scoreCount[questionId] = 0;
      }
      scoreSum[questionId] += rating.score;
      scoreCount[questionId] += 1;
    });

    // Calculate the averages
    const averages = Object.keys(scoreSum).map((questionId) => {
      const avgScore = scoreSum[questionId] / scoreCount[questionId];
      return { questionId, avgScore };
    });

    res.json({ averages });
  } catch (error) {
    console.error("Error computing averages:", error);
    res.status(500).json({ error: "Failed to compute averages" });
  }
});


module.exports = router;