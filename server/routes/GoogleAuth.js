const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

router.post('/google-login', async (req, res) => {
  const { token } = req.body;  // Token from frontend

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID, // Make sure this matches your OAuth client ID
    });

    const payload = ticket.getPayload();
    const userId = payload.sub;
    const email = payload.email;
    const name = payload.name;

    // Here, create/find the user in your database and send back a JWT if needed
    // You can also store the user in the session or send a JWT for frontend storage
    res.status(200).json({
      userId,
      email,
      name,
      message: 'Google authentication successful',
    });
  } catch (error) {
    console.error('Google authentication failed:', error);
    res.status(400).json({ error: 'Invalid Google token' });
  }
});

module.exports = router;
