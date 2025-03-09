const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { validateToken } = require("../middlewares/AuthMiddleware");
const { sign } = require("jsonwebtoken");
const checkRole = require("../middlewares/RoleMiddleware");


router.post("/",async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username already exists
    const existingUser = await Users.findOne({ where: { username: username } });
    if (existingUser) {
      return res.status(400).json({ error: "Username is already taken" });
    }

    // Hash the password
    const hash = await bcrypt.hash(password, 10);

    // Create the user in the database
    await Users.create({
      username: username,
      password: hash,
      role: "user", 
    });

    // Respond with success message after user creation
    res.json("SUCCESS");
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ error: "Failed to create user" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await Users.findOne({ where: { username: username } });

  if (!user) return res.json({ error: "User Doesn't Exist" });

  bcrypt.compare(password, user.password).then(async (match) => {
    if (!match) return res.json({ error: "Wrong Username And Password Combination" });

    const accessToken = sign(
      { username: user.username, id: user.id, role: user.role },  // Include role in the JWT payload
      "importantsecret"
    );
    res.json({ token: accessToken, username: username, id: user.id, role: user.role });
  });
});


router.get("/auth", validateToken, (req, res) => {
  res.json(req.user);
});

router.get("/users", async (req, res) => {
  try {
    const users = await Users.findAll(); // Fetch all users from the database
    res.json(users); // Send users as the response
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.put("/users/:id", validateToken, checkRole('admin'), async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    // Find user by ID and update their role
    const user = await Users.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the role of the user
    user.role = role;
    await user.save();

    res.json({ message: 'Role updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update role' });
  }
});

module.exports = router;