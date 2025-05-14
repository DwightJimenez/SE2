const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_CONTEXT = `
You are an assistant inside a web system. In this system:
- Users can create and comment on posts, but only if they're logged in.
- Admins can create secure polls. Votes can't be altered or submitted twice.
- There's a file upload area, an event calendar, and a post archive.
- Admins and moderators can delete inappropriate content.
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
