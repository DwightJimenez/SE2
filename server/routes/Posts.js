const express = require("express");
const router = express.Router();
const { Posts } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/", async (req, res) => {
  const listOfPosts = await Posts.findAll({ order: [["createdAt", "DESC"]] });
  res.json(listOfPosts);
});





router.post("/", validateToken, async (req, res) => {
  try {
    console.log("📥 Received Request Body:", req.body);
    console.log("🛠️ User from Token:", req.user);

    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text field is required" });
    }

    const username = req.user ? req.user.username : "Unknown";

    const newPost = await Posts.create({ text, username });
    res.json({ success: true, post: newPost });
  } catch (error) {
    console.error("🔥 Error creating post:", error); //
    res
      .status(500)
      .json({ error: "Failed to create post", details: error.message });
  }
});

module.exports = router;
