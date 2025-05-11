const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const db = require("./models");

dotenv.config();
const port = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://192.168.1.6:5173",
      "1fb5-136-158-100-217.ngrok-free.app",
    ],
    credentials: true,
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// app.use(async (req, res, next) => {
//   await new Promise((resolve) => setTimeout(resolve, 2000)); // Delay for 5 seconds
//   next(); // Continue to the next middleware or route
// });

// Routers
const postRouter = require("./routes/Posts");
app.use("/posts", postRouter);
const commentsRouter = require("./routes/Comments");
app.use("/comments", commentsRouter);
const usersRouter = require("./routes/Users");
app.use("/auth", usersRouter);
const eventsRouter = require("./routes/Events");
app.use("/events", eventsRouter);
const docManagement = require("./routes/DocManagement");
app.use("/api", docManagement);
const archiveDoc = require("./routes/ArchiveDoc");
app.use("/archive", archiveDoc);
const auditLog = require("./routes/AuditLog");
app.use("/audit", auditLog);
const evaluation = require("./routes/Evaluation");
app.use("/evaluation", evaluation);
const rating = require("./routes/Rating");
app.use("/rating", rating);
const googleAuth = require("./routes/GoogleAuth");
app.use("/google", googleAuth);
const editor = require("./routes/Editor");
app.use("/editor", editor);

db.sequelize.sync().then(() => {
  app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
  });
});
