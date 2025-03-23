const express = require("express");
const router = express.Router();
const { Comments } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");


router.get("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comments.findAll({
      where: { postId },
      order: [["createdAt", "DESC"]],
    });
    res.json(comments);
  } catch (error) {
    console.error("🔥 Error fetching comments:", error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

router.post("/",validateToken, async (req, res) => {
  try {
    console.log("📥 Received Comment Data:", req.body);

    const { PostId, commentBody } = req.body;
    if (!commentBody) {
      return res.status(400).json({ error: "Comment text is required" });
    }

    const username = req.user.username; // ✅ Get username from token

    // ✅ Insert into database
    const newComment = await Comments.create({ PostId, commentBody, username });
    res.json({ success: true, comment: newComment });
  } catch (error) {
    console.error("🔥 Error posting comment:", error);
    res.status(500).json({ error: "Failed to post comment" });
  }
});

router.delete("/delete/:id", validateToken, async (req, res) => {
  const commentId = parseInt(req.params.id);
  try {
    const comment = await Comments.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    if (comment.username !== req.user.username) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    await comment.destroy();
    res.json({ message: "Comment deleted" });
  } catch (error) {
    console.error("🔥 Error deleting comment:", error);
    res.status(500).json({ error: "Failed to delete comment", details: error.message });
  }
});
module.exports = router;