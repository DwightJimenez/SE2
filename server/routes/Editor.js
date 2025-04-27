const express = require("express");
const router = express.Router();
const {Version} = require("../models");

// Get all versions
router.get("/versions", async (req, res) => {
  try {
    const versions = await Version.findAll({
      order: [["timestamp", "DESC"]], // Sort by timestamp (latest version first)
    });
    res.json(versions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Save a new version
router.post("/save", async (req, res) => {
  const { content, commitMessage } = req.body;

  try {
    const newVersion = await Version.create({
      content,
      commitMessage,
    });
    res.json({ message: "Version saved!", version: newVersion });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
