const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { validateToken } = require("../middlewares/AuthMiddleware");
const { sign, verify } = require("jsonwebtoken");
const checkRole = require("../middlewares/RoleMiddleware");
const { Op, where } = require("sequelize");


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

router.post("/multiple-user", async (req, res) => {
  const users = req.body; // Expecting an array of users

  if (!Array.isArray(users)) {
    return res.status(400).json({ error: "Invalid input format. Expected an array of users." });
  }

  try {
    const usersToCreate = [];

    for (const { username, password } of users) {
      const existingUser = await Users.findOne({ where: { username } });
      if (existingUser) {
        continue; // Skip if the username is already taken
      }
      
      const hash = await bcrypt.hash(password, 10);
      usersToCreate.push({ username, password: hash, role: "user" });
    }

    if (usersToCreate.length > 0) {
      await Users.bulkCreate(usersToCreate); // Bulk insert users
    }

    res.json({ message: "Users created successfully", count: usersToCreate.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create users" });
  }
});

// Update Password Route
router.put("/update-password", validateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await Users.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) return res.status(400).json({ error: "Old password is incorrect" });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await Users.update({ password: hashedNewPassword }, { where: { id: user.id } });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await Users.findOne({ where: { username: username } });

  if (!user) return res.json({ error: "User Doesn't Exist" });

  bcrypt.compare(password, user.password).then(async (match) => {
    if (!match) return res.json({ error: "Wrong Username And Password Combination" });

    const accessToken = sign(
      { username: user.username, id: user.id, role: user.role }, 
      "importantsecret", {expiresIn: "7d"}
    );
    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 3600000,
    });
    res.json({ username: username, id: user.id, role: user.role });
  });
});

router.get("/protected", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const user = verify(token, "importantsecret");
    res.json({ message: "Protected data", user });
  } catch (error) {
    res.status(403).json({ message: "Forbidden" });
  }
});

// Logout Route (Clears Cookie)
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Only use secure in production
    sameSite: "Strict",
  });
  res.status(200).json({ message: "Logged out" });
});



router.get("/auth", validateToken, (req, res) => {
  res.json(req.user);
});

router.get("/users", validateToken, checkRole(["admin", "moderator"] ), async (req, res) => {
  try {
    const { q, role } = req.query;
    
    let whereClause = {};
    if (q) {
      whereClause.username = { [Op.like]: `%${q}%` };
    }
    if (role && role !== "") {
      whereClause.role = role;
    }

    const users = await Users.findAll({ where: whereClause });
    res.json(users);
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

router.delete('/users/:id',validateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Users.destroy({ where: { id } }); // Adjust if you're not using Sequelize
    if (result) {
      res.status(200).send("User deleted");
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).send("Server error");
  }
});


module.exports = router;