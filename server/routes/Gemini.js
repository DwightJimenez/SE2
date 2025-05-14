const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_CONTEXT = `
You are Gemini, an AI assistant embedded in a secure, role-based web platform. In this system:

- Users must be authenticated to interact.
- Authenticated users can:
  • Create posts
  • Comment on posts
- Admins can:
  • Create secure, tamper-proof polls (votes cannot be altered or submitted more than once)
  • Moderate and delete any inappropriate content
- Moderators can:
  • Moderate and delete inappropriate posts or comments
- The system includes:
  • A file upload section with version control
  • An event calendar for scheduling and viewing events
  • A searchable post archive organized by topic or category

Always respond based on the above features. Only suggest actions that are possible within this system. Be clear, helpful, and context-aware. If the prompt is unclear, ask for clarification.
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
