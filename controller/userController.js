// controller/userController.js
const User = require('../model/user');
const bcrypt = require('bcrypt');



// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: 'Error creating user', error });
  }
};

// Update an existing user
exports.updateUser = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Error updating user', error });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const removed = await User.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};

// -------------------------------
// New Endpoints for Profile Editing
// -------------------------------

// Update only the "about_desc" field (Bio)
exports.updateAboutDesc = async (req, res) => {
  try {
    const { about_desc } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { about_desc },
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: 'Error updating bio', error });
  }
};

// -------------------------------
// Skills
// -------------------------------

// Add a new Skill
exports.addSkill = async (req, res) => {
  try {
    const { title, description } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.skills.push({ title, description });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: 'Error adding skill', error });
  }
};

// Update an existing Skill
exports.updateSkill = async (req, res) => {
  try {
    const { title, description } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const skill = user.skills.id(req.params.skillId);
    if (!skill) return res.status(404).json({ message: 'Skill not found' });
    if (title !== undefined) skill.title = title;
    if (description !== undefined) skill.description = description;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: 'Error updating skill', error });
  }
};

// Delete an existing Skill
exports.deleteSkill = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const skill = user.skills.id(req.params.skillId);
    if (!skill) return res.status(404).json({ message: 'Skill not found' });
    user.skills.pull(skill._id);
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: 'Error deleting skill', error });
  }
};

// -------------------------------
// Projects
// -------------------------------

// Add a new Project
exports.addProject = async (req, res) => {
  try {
    const { title, description, photo } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.projects.push({ title, description, photo });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: 'Error adding project', error });
  }
};

// Update an existing Project
exports.updateProject = async (req, res) => {
  try {
    const { title, description, photo } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const project = user.projects.id(req.params.projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;
    if (photo !== undefined) project.photo = photo;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: 'Error updating project', error });
  }
};

// Delete an existing Project
exports.deleteProject = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    console.log("🧪 User ID:", req.params.id);
    console.log("🧪 Project ID from URL:", req.params.projectId);
    console.log("📋 Existing project IDs:", user.projects.map(p => p._id.toString()));

    const project = user.projects.id(req.params.projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    user.projects.pull(req.params.projectId); // ✅ just like we did for skills

    await user.save();
    res.json(user);
  } catch (error) {
    console.error("❌ Error deleting project:", error);
    res.status(400).json({ message: 'Error deleting project', error });
  }
};



// Register a new user (Signup)
exports.registerUser = async (req, res) => {
  try {
    const { email, username, password, phone } = req.body;

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(400).json({ message: 'Username or email already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      username,
      phone,
      password: hashedPassword,
      fullName: username[0].toUpperCase() + username.slice(1),
      profile_img: 'images/default.jpg',
      about_desc: '',
      skills: [],
      projects: []
    });

    await newUser.save();
    res.status(201).json({ message: 'Signup successful!' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

exports.upvoteUser = async (req, res) => {
  try {
    const { voterName } = req.body; // e.g. from localStorage or from the request
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found." });
    // Already upvoted? skip
    if (user.upvotedBy.includes(voterName)) {
      return res.status(400).json({ message: "You already upvoted this user." });
    }
    // If user had previously downvoted, remove that
    if (user.downvotedBy.includes(voterName)) {
      user.downvotedBy.pull(voterName);
      user.votes += 1; // remove that "−1" effect
    }
    user.votes += 1;
    user.upvotedBy.push(voterName);

    await user.save();
    res.json({ votes: user.votes });
  } catch (err) {
    res.status(500).json({ message: "Upvote failed." });
  }
};

exports.downvoteUser = async (req, res) => {
  try {
    const { voterName } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found." });
    // Already downvoted? skip
    if (user.downvotedBy.includes(voterName)) {
      return res.status(400).json({ message: "You already downvoted this user." });
    }
    // If user had previously upvoted, remove that
    if (user.upvotedBy.includes(voterName)) {
      user.upvotedBy.pull(voterName);
      user.votes -= 1; // remove that "+1" effect
    }
    user.votes -= 1;
    user.downvotedBy.push(voterName);

    await user.save();
    res.json({ votes: user.votes });
  } catch (err) {
    res.status(500).json({ message: "Downvote failed." });
  }
};


// Update profile picture
exports.updateProfilePic = async (req, res) => {
  try {
    const userId = req.params.id;
    const imagePath = `images/${req.file.filename}`; // Save path

    const updatedUser = await User.findByIdAndUpdate(
        userId,
      { profile_img: imagePath },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.json(updatedUser);
  } catch (err) {
    console.error("❌ Failed to update profile image:", err);
    res.status(500).json({ message: "Server error." });
  }
};


exports.updateEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.params.id, { email }, { new: true });
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: 'Error updating email', error });
  }
};

exports.updatePhone = async (req, res) => {
  try {
    const { phone } = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.params.id, { phone }, { new: true });
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: 'Error updating phone', error });
  }
};

exports.updateProjectPhoto = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const project = user.projects.id(req.params.projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const imagePath = `images/${req.file.filename}`;
    project.photo = imagePath;
    await user.save();

    res.json(user);
  } catch (err) {
    console.error("❌ Failed to update project image:", err);
    res.status(500).json({ message: "Server error." });
  }
};

