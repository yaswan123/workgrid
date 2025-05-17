const cron = require('node-cron');
const taskDeadline = require('../pages/taskDeadline');
const sendMail = require('../config/nodeMailer');
const Task = require("../models/task.model");
const User = require("../models/user.model");

const notifyBeforeDueDate = async () => {
  try {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    // Start and end of tomorrow
    const startOfTomorrow = new Date(tomorrow);
    startOfTomorrow.setHours(0, 0, 0, 0);
    const endOfTomorrow = new Date(tomorrow);
    endOfTomorrow.setHours(23, 59, 59, 999);

    // Find tasks due tomorrow
    const tasks = await Task.find({
      dueDate: {
        $gte: startOfTomorrow,
        $lt: endOfTomorrow,
      }
    });

    console.log("Tasks due tomorrow:", tasks.length);  // Log number of tasks

    for (const task of tasks) {
      const assignedUsers = await User.find({ _id: { $in: task.assignedTo } });
      const emails = assignedUsers.map(user => user.email);

      for (const email of emails) {
        const subject = `Reminder: Task Deadline Approaching for ${task.title}`;
        const htmlContent = taskDeadline(task);  // Email template with task details

        try {
          await sendMail(email, subject, htmlContent);  // Await to ensure emails are sent sequentially
          console.log(`Reminder email sent to: ${email}`);
        } catch (sendError) {
          console.error(`Failed to send email to ${email}:`, sendError);
        }
      }
    }
  } catch (error) {
    console.error("Error checking for due dates:", error);
  }
};

// Run the job every day at 8 AM
cron.schedule("0 8 * * *", notifyBeforeDueDate);

module.exports = notifyBeforeDueDate;
