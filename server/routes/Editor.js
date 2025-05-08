const express = require("express");
const router = express.Router();
const { Version, File, Users } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");
const { sequelize } = require("../models");

// Get all versions
router.get("/versions/", async (req, res) => {
  try {
    const versions = await Version.findAll({
      order: [["timestamp", "DESC"]], // Sort by timestamp (latest version first)
    });
    res.json(versions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Backend route to get versions for a specific file
router.get("/versions/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const versions = await Version.findAll({
      where: { fileId: id },
      include: {
        model: Users,
        attributes: ["id", "username"],
      },
      order: [["timestamp", "DESC"]],
    });
    res.json(versions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/file", async (req, res) => {
  try {
    const files = await File.findAll({
      include: [{ model: Version }],
    });
    res.status(200).json(files);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});

router.get("/file/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const file = await File.findOne({
      where: { id },
      include: [
        {
          model: Version,
          separate: true,
          order: [["timestamp", "DESC"]],
          include: {
            model: Users,
            attributes: ["id", "username"],
          },
        },
      ],
    });
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }
    res.status(200).json(file);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});
router.post("/file/create", async (req, res) => {
  let { name } = req.body;
  try {
    let count = 1;
    let baseName = name;
    while (await File.findOne({ where: { name } })) {
      name = `${baseName} ${count++}`;
    }

    const file = await File.create({ name });
    res.status(201).json(file);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});
router.post("/save", validateToken, async (req, res) => {
  try {
    const { content, commitMessage, fileId } = req.body;
    const user = req.user.id;

    const newVersion = await Version.create({
      content,
      commitMessage,
      fileId: fileId,
      userId: user,
    });

    res.json({ message: "Version saved!", version: newVersion });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
