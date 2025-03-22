const { verify } = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  // Read token from cookies
  const accessToken = req.cookies.token; // Access the cookie directly

  if (!accessToken) {
    return res.status(401).json({ error: "User not logged in!" });
  }

  try {
    const validToken = verify(accessToken, "importantsecret");
    req.user = validToken; // Attach the decoded token to the request object

    // If the token is valid, proceed to the next middleware
    if (validToken) {
      return next();
    }
  } catch (err) {
    return res.status(403).json({ error: "Invalid token!" });
  }
};

module.exports = { validateToken };
