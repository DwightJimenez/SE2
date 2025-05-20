const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const moment = require("moment");
const { Events, AuditLog, File } = require("../models"); // Adjust this path if needed
const { sequelize } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_CONTEXT = `

You are an assistant inside a web system. In this system:
- Users can create and comment on posts, but only if they're logged in.
- Admins can create and delete events, create and delete form for evaluation for user to rate, create, delete and archive document with version control.
- There's a file upload area, an event calendar, and a document and form archive.
- Admins and moderators can delete inappropriate content.
- Users can view events and document but readonly.
- Users can rate the evaluation form.
- Users can view their own ratings.
- Navbar profile icon shows the user's name and profile picture on drawer, can change password and logout.
- Sidebar shows navigation links to different sections of the system.
- Sidebar contains links to the home where post and comment can be found, events(calendar), evaluation, documents. And this is exclusive on for moderator archive, eventlist that can create and delete, create form, create doc, auditlog, and manage user for admin can add user.
Always respond based on this system's capabilities.
You are an assistant inside a web system.
If a user asks to create an event, extract the title, start and end datetime. Respond in the following JSON format:
{
  "intent": "create_event",
  "title": "Event Title",
  "start": "2025-05-20T10:00:00",
  "end": "2025-05-20T11:00:00",
  "reply": "Creating your event titled 'Event Title'..."
}
If a user asks to create a document, extract the document name. Respond in the following JSON format:
{
  "intent": "create_document",
  "name": "Document Title",
  "reply": "Creating the document named 'Document Title'..."
}

If not creating an event or document, just reply normally as text.

`;

router.post("/generate", validateToken,async (req, res) => {
  const { prompt } = req.body;
  const user = req.user?.id || 1; // fallback if not logged in

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(
      SYSTEM_CONTEXT + "\n\nUser: " + prompt
    );
    let text = result.response.text();

    // Clean up ```json ... ``` format if it exists

    if (text.startsWith("```json")) {
      text = text.slice(7);
      text = text.slice(0, -4);
    }

    text = text.trim();
    console.log("Gemini raw output:", text);
    let responseJson;
    try {
      responseJson = JSON.parse(text);
    } catch {
      // Not JSON - fallback to plain response
      return res.json({ response: text });
    }

    // Handle event creation
    if (responseJson.intent === "create_event") {
      const { title, start, end, reply } = responseJson;

      const startUTC = moment(start).utc().format("YYYY-MM-DD HH:mm:ss");
      const endUTC = moment(end).utc().format("YYYY-MM-DD HH:mm:ss");

      const newEvent = await Events.create({
        title,
        start: startUTC,
        end: endUTC,
      });

      await AuditLog.create({
        action: "Created an event via assistant",
        title,
        userId: user,
      });

      return res.json({
        response: reply,
        createdEvent: newEvent,
      });
    }

    if (responseJson.intent === "create_document") {
      let { name, reply } = responseJson;
      if (!name || typeof name !== "string") {
        return res.status(400).json({ error: "Invalid document name." });
      }

      name = name.trim();
      let count = 1;
      const baseName = name;

      while (await File.findOne({ where: { name } })) {
        name = `${baseName} ${count++}`;
      }

      const file = await File.create({ name });

      await AuditLog.create({
        action: "Created a document via assistant",
        title: name,
        userId: user,
      });

      return res.json({
        response: reply,
        createdDocument: file,
      });
    }

    // Default fallback
    res.json({ response: text });
  } catch (error) {
    console.error("Gemini error:", error);
    res.status(500).json({ error: "Failed to generate or process request." });
  }
});

module.exports = router;
