const bcrypt = require("bcrypt");
const User = require("../models/user.model");

const getUser = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const regUser = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" });
    const hashed = await bcrypt.hash(req.body.password, 10);
    const user = { ...req.body, password: hashed };
    await User.create(user);
    res.status(200).send({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ message: "User not found" });
    let result = await bcrypt.compare(req.body.password, user.password);
    if (!result) return res.status(400).json({ message: "Invalid password" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const modifyUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    let user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getGrp = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate({
      path: "groups",
      populate: {
        path: "people",
        select: "username", // Only fetch usernames
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    // Format response: Replace 'people' field with usernames
    const groupsWithUsernames = user.groups.map((group) => ({
      _id: group._id,
      name: group.name,
      description: group.description,
      people: group.people.map((person) => person.username), // Convert user IDs to usernames
    }));

    res.status(200).json(groupsWithUsernames);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUser,
  getGrp,
  regUser,
  loginUser,
  modifyUser,
  deleteUser,
};
