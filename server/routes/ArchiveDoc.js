const express = require("express");
const multer = require("multer");
const {
  Evaluation,
  Question,
  ArchivedDocument,
  AuditLog,
  File,
  Version,
} = require("../models");
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

router.post("/:id", validateToken, async (req, res) => {
  const { id } = req.params;
  const { type } = req.body;

  try {
    const document = await File.findByPk(id);
    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    // Find versions of the document
    const versions = await Version.findAll({ where: { fileId: document.id } });

    // Create archived record
    const archivedDoc = await ArchivedDocument.create({
      name: document.name,
      type: type,
    });

    // Reassign each version to archivedFileId
    await Promise.all(
      versions.map(async (v) => {
        v.archivedFileId = archivedDoc.id;
        v.fileId = null;
        await v.save();
      })
    );

    // Now safely delete the file
    await document.destroy();

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

    const archivedDocument = await ArchivedDocument.findByPk(id);
    if (!archivedDocument) {
      return res.status(404).json({ error: "Archived document not found" });
    }

    if (archivedDocument.type === "Document") {
      const restoredFile = await File.create({
        name: archivedDocument.name,
      });

      const versions = await Version.findAll({
        where: { archivedFileId: archivedDocument.id },
      });

      await Promise.all(
        versions.map(async (v) => {
          v.fileId = restoredFile.id;
          v.archivedFileId = null;
          await v.save();
        })
      );

      await AuditLog.create({
        action: "Restore",
        title: archivedDocument.name,
        userId: req.user.id,
      });

      await archivedDocument.destroy();
      return res.json({ message: "Document restored successfully" });
    }

    if (archivedDocument.type === "Form") {
      const restoredForm = await Evaluation.create({
        title: archivedDocument.name,
      });

      const questions = await Question.findAll({
        where: { archivedFileId: archivedDocument.id },
      });

      await Promise.all(
        questions.map(async (q) => {
          q.EvaluationId = restoredForm.id;
          q.archivedFileId = null;
          await q.save();
        })
      );

      await AuditLog.create({
        action: "Restore",
        title: archivedDocument.name,
        userId: req.user.id,
      });

      await archivedDocument.destroy();
      return res.json({ message: "Form restored successfully" });
    }

    // Handle unknown type just in case
    return res.status(400).json({ error: "Unsupported archive type" });
  } catch (error) {
    console.error("Restore error:", error);
    res.status(500).json({ error: "Failed to restore document" });
  }
});

router.post("/form/:id", validateToken, async (req, res) => {
  const { id } = req.params;
  const { type } = req.body;

  try {
    const form = await Evaluation.findByPk(id);
    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    // Find versions of the document
    const question = await Question.findAll({
      where: { EvaluationId: form.id },
    });

    // Create archived record
    const archivedDoc = await ArchivedDocument.create({
      name: form.title,
      type: type,
    });

    // Reassign each version to archivedFileId
    await Promise.all(
      question.map(async (q) => {
        q.archivedFileId = archivedDoc.id;
        q.fileId = null;
        await q.save();
      })
    );

    // Now safely delete the file
    await form.destroy();

    // Create audit log
    await AuditLog.create({
      action: "Archive",
      title: form.title,
      userId: req.user.id,
    });
    console.log("Audit log created for archiving");

    res.json({ message: "Document archived successfully" });
  } catch (error) {
    console.error("Error during archiving process:", error.message);
    res.status(500).json({ error: "Failed to archive document" });
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
