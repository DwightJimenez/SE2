const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

const db = require("./models");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routers
const postRouter = require("./routes/Posts");
app.use("/posts", postRouter);
const commentsRouter = require("./routes/Comments");
app.use("/comments", commentsRouter);
const usersRouter = require("./routes/Users");
app.use("/auth", usersRouter);
const eventsRouter = require("./routes/Events");
app.use("/events", eventsRouter);
const docManagement = require("./routes/DocManagement")
app.use("/api", docManagement)
const archiveDoc = require('./routes/ArchiveDoc')
app.use('/archive', archiveDoc)
const auditLog = require('./routes/AuditLog');
app.use('/audit', auditLog);

db.sequelize.sync().then(() => {
  app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
  });
});