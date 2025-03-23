const express = require("express");
const router = express.Router();
const { Posts, Likes } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/", validateToken, async (req, res) => {
  const userId = req.user.id;
  const listOfPosts = await Posts.findAll({
    order: [["createdAt", "DESC"]],
    include: [{ model: Likes, attributes: ['UserId'] }],
  });
  const updatedPosts = listOfPosts.map((post) => ({
    ...post.toJSON(),
    likedByUser: post.Likes.some((like) => like.UserId === userId),
  }));

  res.json(updatedPosts);
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

router.delete("/delete/:id", validateToken, async (req, res) => {
  const postId = parseInt(req.params.id);
  try {
    const post = await Posts.findByPk(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (post.username !== req.user.username) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    await post.destroy();
    res.json({ message: "Post deleted" });
  } catch (error) {
    console.error("🔥 Error deleting post:", error);
    res
      .status(500)
      .json({ error: "Failed to delete post", details: error.message });
  }
});

router.post("/like/:id", validateToken, async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const userId = req.user.id;

    const exist = await Likes.findOne({ where: { PostId: postId, UserId: userId } });

    if (!exist) {
      await Likes.create({ PostId: postId, UserId: userId });
      
      return res.json("Liked"); // Stop execution after sending response
  
    } else {
      await Likes.destroy({ where: { PostId: postId, UserId: userId } });
      return res.json("Unliked"); // Stop execution after sending response
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});


module.exports = router;
