const express = require("express");
const router = express.Router();
const { Posts, Likes, Comments, Users } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/", validateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const offset = (page - 1) * limit;

    const { count, rows } = await Posts.findAndCountAll({
      order: [["createdAt", "DESC"]],
      limit,
      offset,
      include: [
        { model: Likes, attributes: ["UserId"] },
        { model: Comments, as: "Comments" },
        { model: Users, attributes: ["username"] },
      ],
    });

    const updatedPosts = rows.map((post) => ({
      ...post.toJSON(),
      likedByUser: post.Likes.some((like) => like.UserId === userId),
      username: post.User ? post.User.username : null,
    }));

    res.json({ posts: updatedPosts, total: count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.post("/", validateToken, async (req, res) => {
  try {
    console.log("📥 Received Request Body:", req.body);
    console.log("🛠️ User from Token:", req.user);

    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text field is required" });
    }

    const userId = req.user.id;

    const newPost = await Posts.create({ text, userId });
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

    const exist = await Likes.findOne({
      where: { PostId: postId, UserId: userId },
    });

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
