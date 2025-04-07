const express = require("express");
const router = express.Router();
const { Evaluation, Question, Rating } = require("../models");
const { sequelize } = require("../models");

router.get("/", async (req, res) => {
  try {
    const evaluations = await Evaluation.findAll({
      include: [{ model: Question }],
    });
    res.status(200).json(evaluations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});

router.post("/save-form", async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    let { title, description, questions } = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return res
        .status(400)
        .json({ error: "Questions must be an array and cannot be empty" });
    }

    // Ensure unique title by appending a number if needed
    let count = 1;
    let baseTitle = title;
    while (await Evaluation.findOne({ where: { title } })) {
      title = `${baseTitle} ${count++}`;
    }

    const evaluation = await Evaluation.create(
      { title, description },
      { transaction }
    );

    const questionData = questions.map((q) => ({
      text: q.text,
      EvaluationId: evaluation.id, // Remove type
    }));

    await Question.bulkCreate(questionData, { transaction });

    await transaction.commit();
    res.status(201).json({ message: "Form saved successfully!" });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
});

router.put("/update/:id", async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { title, description, questions } = req.body;

    const evaluation = await Evaluation.findByPk(id);
    if (!evaluation) {
      return res.status(404).json({ error: "Evaluation not found" });
    }

    // Update title and description
    await evaluation.update(
      { title, description },
      { transaction }
    );

    // Delete existing questions
    await Question.destroy({ where: { EvaluationId: id }, transaction });

    // Insert updated questions
    const questionData = questions.map((q) => ({
      text: q.text,
      EvaluationId: id,
    }));
    await Question.bulkCreate(questionData, { transaction });

    await transaction.commit();
    res.json({ message: "Form updated successfully!" });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
});

router.get("/byId/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const evaluation = await Evaluation.findByPk(id, {
      include: [{ model: Question, include: [Rating] }],
    });

    if (!evaluation) {
      return res.status(404).json({ error: "Evaluation not found" });
    }

    // Prepare data for the graph
    evaluation.Questions.forEach((question) => {
      const ratings = question.Ratings;

      // Initialize a score count for 1, 2, 3, 4, 5
      const scoreCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

      // Count the occurrences of each score
      ratings.forEach((rating) => {
        if (rating.score >= 1 && rating.score <= 5) {
          scoreCount[rating.score]++;
        }
      });

      if (ratings && ratings.length > 0) {
        const totalScore = ratings.reduce((sum, rating) => sum + rating.score, 0);
        const averageScore = totalScore / ratings.length;
        question.averageScore = averageScore.toFixed(2);  // Round to 2 decimal places
      } else {
        question.averageScore = 0;  // No ratings, set average to 0
      }

      // Explicitly add `averageScore` to the question data to make sure it's included in the response
      question.dataValues.averageScore = question.averageScore; 

      // Add the score count data to the question's dataValues
      question.dataValues.scoreCount = scoreCount;
    });

    

    res.json(evaluation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});


router.delete("/delete/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const evaluation = await Evaluation.findByPk(id);
    if (!evaluation) {
      return res.status(404).json({ error: "Comment not found" });
    }
    
    await evaluation.destroy();
    res.json({ message: "Evaluation deleted" });
  } catch (error) {
    console.error("🔥 Error deleting evaluation:", error);
    res.status(500).json({ error: "Failed to delete evaluation", details: error.message });
  }
});


module.exports = router;
