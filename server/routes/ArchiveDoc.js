const express = require("express");
const multer = require("multer");
const { Document, ArchivedDocument, AuditLog, File } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");
const router = express.Router();

router.get("/", validateToken, async (req, res) => {
  try {
    const archiveDoc = await ArchivedDocument.findAll();
    res.json(archiveDoc);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch documents" });
  }
});

router.post("/:id", validateToken,  async (req, res) => {
  const { id } = req.params;
  const user = req.user.username
  
  try {
    const document = await File.findByPk(id);
    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    // Log the document found
    console.log("Document found:", document);

    // Create a new record in the archived table
    await ArchivedDocument.create({
      name: document.name,
    });

    // Delete the document from the original table
    await document.destroy();
    console.log("Document destroyed:", document.id);

    // Create audit log
    await AuditLog.create({
      action: "Archive",
      title: document.name,
      userId: req.user.id,
    });
    console.log("Audit log created for archiving");

    res.json({ message: "Document archived successfully" });
  } catch (error) {
    console.error("Error during archiving process:", error.message);
    res.status(500).json({ error: "Failed to archive document" });
  }
});


router.post("/restore/:id", validateToken, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id)
    const archivedDocument = await ArchivedDocument.findByPk(id);

    if (!archivedDocument) {
      return res.status(404).json({ error: "Archived document not found" });
    }

    // Create a new record in the original documents table
    await File.create({
      name: archivedDocument.name,
    });

    await AuditLog.create({
      action: "Restore",
      title: archivedDocument.name,
      userId: req.user.id,
    });

    // Delete the document from the archived table
    await archivedDocument.destroy();

    res.json({ message: "Document restored successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to restore document" });
  }
});

router.delete("/delete/:id", validateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const archivedDocument = await ArchivedDocument.findByPk(id);

    if (!archivedDocument) {
      return res.status(404).json({ error: "Archived document not found" });
    }

    await AuditLog.create({
      action: "Delete",
      title: archivedDocument.name,
      userId: req.user.id,
    });
    await archivedDocument.destroy();
    res.json({ message: "Archived document deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete archived document" });
  }
});

module.exports = router;
