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
router.get("/user/:formId", validateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const formId = req.params.formId;
  

    const ratings = await Rating.findAll({
      where: { UserId:userId },
      attributes: ["QuestionId", "score"],
      include: {
        model: Question, // Make sure Question is correctly imported
        where: { FormId: formId }, // Filter by the correct form
        attributes: [], // Don't return Question data
      },
    });

    res.json({ ratings });
    
  } catch (error) {
    console.error("Error fetching user ratings:", error);
    res.status(500).json({ error: "Failed to fetch ratings" });
  }
});



module.exports = router;