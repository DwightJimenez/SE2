const { verify } = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  const accessToken = req.header("accessToken");

  if (!accessToken) {
    return res.json({ error: "User not logged in!" });
  }

  try {
    const validToken = verify(accessToken, "importantsecret");
    req.user = validToken;  // Attach the decoded token to the request object

    // If you want to check the role here as well
    if (validToken) {
      return next();  // Proceed if the token is valid
    }
  } catch (err) {
    return res.json({ error: err });
  }
};



module.exports = { validateToken};
