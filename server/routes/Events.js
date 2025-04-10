const express = require("express");
const router = express.Router();
const { Events, AuditLog } = require("../models");
const moment = require("moment");
const checkRole = require("../middlewares/RoleMiddleware");
const { validateToken } = require("../middlewares/AuthMiddleware");
const { where } = require("sequelize");

// Get all events
router.get("/", async (req, res) => {
  try {
    const events = await Events.findAll();

    // Convert stored event times to local time zone
    const formattedEvents = events.map((event) => {
      return {
        ...event.toJSON(),
        start: moment(event.start).local().format("YYYY-MM-DDTHH:mm:ss"), // Local time format
        end: moment(event.end).local().format("YYYY-MM-DDTHH:mm:ss"), // Local time format
      };
    });
    res.json(formattedEvents);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// Create a new event
router.post(
  "/",
  validateToken,
  checkRole(["moderator", "admin"]),
  async (req, res) => {
    const { title, start, end } = req.body;
    const user = req.user.username;

    try {
      // Convert the start and end time to UTC before saving to the database
      const startUTC = moment(start).utc().format("YYYY-MM-DD HH:mm:ss");
      const endUTC = moment(end).utc().format("YYYY-MM-DD HH:mm:ss");

      const newEvent = await Events.create({
        title,
        start: startUTC,
        end: endUTC,
      });
      await AuditLog.create({
        action: "Created an event",
        title: title,
        user: user,
      });
      res.json(newEvent);
    } catch (error) {
      res.status(500).json({ error: "Failed to create event" });
    }
  }
);

// Delete an event
router.delete(
  "/:id",
  validateToken,
  checkRole("moderator"),
  async (req, res) => {
    const { id } = req.params;
    console.log("Received ID for deletion:", id); // Debugging

    try {
      const event = await Events.findByPk(id);
      if (!event) {
        console.error("Event not found for ID:", id); // Debugging
        return res.status(404).json({ error: "Event not found" });
      }
      await AuditLog.create({
        action: "Deleted an event",
        title: event.title,
        user: "admin",
      });
      await event.destroy();

      res.json({ message: "Event deleted successfully" });
    } catch (error) {
      console.error("Error in delete route:", error); // Debugging
      res.status(500).json({ error: "Failed to delete event" });
    }
  }
);

module.exports = router;
