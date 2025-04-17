const express = require("express");
const { AuditLog, Users } = require("../models");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const logs = await AuditLog.findAll({
      include: {
        model: Users,
        attributes: ["id", "username"],
      },
      order: [["timestamp", "DESC"]],
    });
    console.log(logs)
    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch audit logs" });
  }
});

module.exports = router;
