const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);
const { sign } = require("jsonwebtoken");

// Link Google Account after login
router.post("/link-google", validateToken, async (req, res) => {
  const { token } = req.body;
  console.log("Received token from frontend:", token);

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const fullName = payload.name;
    const picture = payload.picture;

    const schoolDomain = "@bicol-u.edu.ph";
    if (!email.endsWith(schoolDomain)) {
      return res.status(400).json({ error: "Only school Gmail accounts are allowed" });
    }

    const user = await Users.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.email = email;
    user.username = fullName;
    user.profilePicture = picture;
    console.log(picture);
    await user.save();

    // Sign a new token with updated email
    const accessToken = sign(
      {
        username: user.username,
        id: user.id,
        role: user.role,
        email: user.email,
      },
      "importantsecret",
      { expiresIn: "7d" }
    );

    // Update the cookie
    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 3600000,
    });

    res.json({ message: "Google account linked successfully", user });
  } catch (error) {
    console.error("Google authentication failed:", error);
    res.status(400).json({ error: "Failed to link Google account" });
  }
});

router.post("/google-login", async (req, res) => {
  const { token } = req.body; // Get the Google token from the request body

  try {
    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID, // Replace with your Google Client ID
    });

    // Get the Google user info from the ticket
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    // Check if the user exists in your database
    const user = await Users.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // If user exists, generate a JWT token
    const accessToken = sign(
      {
        username: user.username,
        id: user.id,
        role: user.role,
        email: user.email,
      },
      "importantsecret",
      { expiresIn: "7d" }
    );

    // Update the cookie with the new token
    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 3600000,
    });

    // Send the response with user info and the token
    console.log(user)
    res.json({ message: "Google login successful", user, picture});
  } catch (error) {
    console.error("Error verifying Google token:", error);
    res.status(400).json({ error: "Google login failed" });
  }
});

module.exports = router;
