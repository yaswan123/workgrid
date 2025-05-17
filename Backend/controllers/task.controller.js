const Task = require("../models/task.model");
const User = require("../models/user.model");
const Group = require("../models/group.model");
const sendMail = require("../config/nodeMailer");
const taskTemplate = require("../pages/taskTemplate")
const addedUserTemplate = require("../pages/addedUserTemplate")
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserTasks = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId).populate("tasks");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user.tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getCorrectCloudinaryUrl = (file) => {
  let fileUrl = file.path;

  if (file.mimetype === "application/pdf") {
    // Ensure the URL is correctly formatted for raw files
    fileUrl = fileUrl.replace("/image/upload/", "/raw/upload/");
  }

  // Add `fl_attachment:` to force download
  return fileUrl.replace("/upload/", "/upload/fl_attachment:");
};

const createTask = async (req, res) => {
  const { createdBy, groupId } = req.body;
  let { assignedTo } = req.body;
  try {
    // Check if the creator exists
    const user = await User.findById(createdBy);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Validate assigned users
    let assignedUsers = [];
    let assignedToId = []
    if (assignedTo && assignedTo.length > 0) {
      assignedTo = JSON.parse(assignedTo)
      assignedUsers = await User.find({ username: { $in: assignedTo } });
      if (assignedUsers.length !== assignedTo.length) {
        return res
          .status(404)
          .json({ message: "One or more assigned users not found" });
      }
      assignedToId = assignedUsers.map((user) => user._id);
    }

    // Handle multiple file uploads
    let formattedFiles = [];
    if (req.files && req.files.length > 0) {
      formattedFiles = req.files.map((file) => ({
        fileName: file.originalname,
        filePath: file.path, // Cloudinary display URL
        downloadUrl: getCorrectCloudinaryUrl(file), // Properly formatted download URL
      }));
    }

    // Create new task
    const task = new Task({
      ...req.body,
      assignedTo: assignedToId,
      files: formattedFiles,
    });
    const newTask = await task.save();

    // Add task to creator's list
    if(!groupId){
      await User.findByIdAndUpdate(createdBy, {
        $addToSet: { tasks: newTask._id },
      });
    }


    // Add task to group if groupId exists
    if (groupId) {
      const group = await Group.findById(groupId);
      if (!group) return res.status(404).json({ message: "Group not found" });

      await Group.findByIdAndUpdate(groupId, {
        $addToSet: { tasks: newTask._id },
      });
    }

    if (assignedUsers.length > 0) {
      const taskTitle = task.title || "a task";
      assignedUsers.forEach(async (taggedUser) => {
        // Send email to each tagged user
        await sendMail(taggedUser.email, `You were tagged in a task: ${taskTitle}`, taskTemplate(taggedUser, user, task));
      });
    }

    res.status(201).json(newTask);
  } catch (error) {
    console.error("Create Task Error:", error);
    res.status(400).json({ message: error.message });
  }
};

const editTask = async (req, res) => {
  const taskId = req.params.id;
  let {assignedTo} = req.body
  try {
    let assignedUsers = [];
    let assignedToId = []
    if (assignedTo && assignedTo.length > 0) {
      // assignedTo = JSON.parse(assignedTo)
      assignedTo = assignedTo.map(user => user.username)
      assignedUsers = await User.find({ username: { $in: assignedTo } });
      if (assignedUsers.length !== assignedTo.length) {
        return res
          .status(404)
          .json({ message: "One or more assigned users not found" });
      }
      assignedToId = assignedUsers.map((user) => user._id);
    }
    const result = await Task.findByIdAndUpdate(taskId, {
      ...req.body,
      assignedTo: assignedToId
    }, {
      new: true,
    });
    if (assignedUsers.length > 0) {
      const taskTitle = req.body.title || "a task";
      assignedUsers.forEach(async (taggedUser) => {
        // Send email to each tagged user
        await sendMail(taggedUser.email, `You were tagged in a task: ${taskTitle}`, addedUserTemplate(taggedUser, req.body));
      });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  const taskId = req.params.id;
  try {
    const result = await Task.findByIdAndDelete(taskId);
    await User.updateMany({}, { $pull: { tasks: taskId } });
    await Group.updateMany({}, { $pull: { tasks: taskId } });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addMention = async (req, res) => {
  const taskId = req.params.id;
  const assignedUsernames = req.body.assignedTo;

  try {
    const task = await Task.findById(taskId).populate("groupId");
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (!task.groupId)
      return res
        .status(400)
        .json({ message: "Task must be linked to a group" });

    const groupId = task.groupId._id.toString();

    if (!Array.isArray(assignedUsernames) || assignedUsernames.length === 0) {
      return res
        .status(400)
        .json({ message: "Assigned usernames should be a non-empty array" });
    }

    // Find user IDs based on usernames
    const users = await User.find({ username: { $in: assignedUsernames } });

    if (users.length !== assignedUsernames.length) {
      return res
        .status(404)
        .json({ message: "One or more usernames not found" });
    }

    const userIds = users.map((user) => user._id); // Extract user IDs

    // Ensure all assigned users are part of the task's group
    const invalidUsers = users.filter(
      (user) => !Array.isArray(user.groups) || !user.groups.includes(groupId)
    );
    if (invalidUsers.length > 0) {
      return res
        .status(400)
        .json({
          message: "All assigned users must be part of the task's group",
        });
    }

    // Add user IDs to `assignedTo` without duplicates
    await Task.findByIdAndUpdate(taskId, {
      $addToSet: { assignedTo: { $each: userIds } },
    });

    res.status(200).json({ message: "Users assigned successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const sevenDaysAgo = new Date();
// sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

// db.tasks.aggregate([
//   {
//     $match: {
//       createdAt: { $gte: sevenDaysAgo } // Tasks created in the last 7 days
//     }
//   },
//   {
//     $group: {
//       _id: { date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } } },
//       tasksCount: { $sum: 1 }
//     }
//   },
//   { $sort: { "_id.date": 1 } }
// ]);

// Route to get day-wise task count for the last 7 days created by a specific user
const mongoose = require("mongoose");

const getDayWiseTaskCount = async (req, res) => {
    const { id: userId } = req.params;  // Corrected destructuring

    if (!userId) {
        return res.status(400).json({ error: "Missing userId parameter" });
    }

    try {
        const now = new Date();  // Current date and time
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 6);  // 6 days back + today = 7 days


        // Convert userId to ObjectId
        const objectId = new mongoose.Types.ObjectId(userId);

        // Aggregate day-wise count
        const taskCounts = await Task.aggregate([
            {
                $match: {
                    createdBy: objectId,
                    createdAt: { $gte: sevenDaysAgo, $lte: now }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id": 1 }  // Sort by date ascending
            }
        ]);

        // Prepare day-wise array
        const dayWiseCounts = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(now.getDate() - i);
            const dateString = date.toISOString().split('T')[0];

            const taskForDay = taskCounts.find(task => task._id === dateString);
            dayWiseCounts.push(taskForDay ? taskForDay.count : 0);
        }

        res.json({
            dayWiseCounts
        });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
  getTasks,
  getUserTasks,
  createTask,
  editTask,
  deleteTask,
  addMention,
  getDayWiseTaskCount
};
