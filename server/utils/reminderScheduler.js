const cron = require("node-cron");
const dayjs = require("dayjs");
const { Events, Users } = require("../models");
const sendEmail = require("../utils/emailService");
const { Op } = require("sequelize");
const utc = require("dayjs/plugin/utc");

dayjs.extend(utc);

// Run every minute for testing (change to '0 8 * * *' in production)
cron.schedule("0 8 * * *", async () => {
  console.log("🔔 Checking for upcoming events...");

  const tomorrow = dayjs().add(1, "day").startOf("day").toDate();
  const inThreeDays = dayjs().add(3, "day").startOf("day").toDate();
  const tomorrowEnd = dayjs().add(1, "day").endOf("day").toDate();
  const inThreeDaysEnd = dayjs().add(3, "day").endOf("day").toDate();

  try {
    const upcomingEvents = await Events.findAll({
      where: {
        start: {
          [Op.or]: [
            { [Op.between]: [tomorrow, tomorrowEnd] },
            { [Op.between]: [inThreeDays, inThreeDaysEnd] },
          ],
        },
      },
    });

    const users = await Users.findAll({
      where: {
        email: { [Op.ne]: null },
      },
    });

    for (const event of upcomingEvents) {
      for (const user of users) { 
        await sendEmail({
          to: user.email,
          subject: `📅 Reminder: ${event.title} is coming up!`,
          text: `Hi ${user.name || "User"},\n\nReminder: "${
            event.title
          }" starts on ${dayjs(event.start).utc().local().format(
            "MMMM D, YYYY h:mm A"
          )}.\n\n— Org Automation`,
        });
      }
    }

    console.log(`✅ Sent reminders for ${upcomingEvents.length} events.`);
  } catch (error) {
    console.error("❌ Error sending reminders:", error);
  }
});
