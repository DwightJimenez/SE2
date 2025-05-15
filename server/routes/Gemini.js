const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
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
`;

router.post("/generate", async (req, res) => {
  const { prompt } = req.body;
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(SYSTEM_CONTEXT + "\n\nUser: " + prompt);
    const response = result.response.text();

    res.json({ response });
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({ error: "Failed to generate content." });
  }
});

module.exports = router;
