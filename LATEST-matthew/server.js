// server.js
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcrypt');
const cors = require('cors'); // Uncomment if needed
const User = require('./model/user'); // The Mongoose model
const seedUsers = require('./model/sampleData.js');
const userController = require('./controller/userController');

const app = express();
const PORT = 3000;

// 0) (Optional) CORS
// app.use(cors()); // Uncomment if you want cross-domain requests

// 1) Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/portfolio')
  .then(() => {
    console.log("✅ MongoDB connected");
    // Seed the DB with sample users on startup (optional)
    // seedUsers();
  })
  .catch(err => console.error("❌ MongoDB connection error:", err));

// 2) Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// 3) CRUD Routes for /api/users
app.get('/api/users', userController.getAllUsers);

app.post('/api/users', userController.createUser);
app.put('/api/users/:id', userController.updateUser);
app.delete('/api/users/:id', userController.deleteUser);

// 4) New Routes for updating bio, skills, and projects
app.put('/api/users/:id/about', userController.updateAboutDesc);

app.post('/api/users/:id/skills', userController.addSkill);
app.put('/api/users/:id/skills/:skillId', userController.updateSkill);
app.delete('/api/users/:id/skills/:skillId', userController.deleteSkill);

app.post('/api/users/:id/projects', userController.addProject);
app.put('/api/users/:id/projects/:projectId', userController.updateProject);
app.delete('/api/users/:id/projects/:projectId', userController.deleteProject);

// 5) API Route: Get user JSON by identifier (username or fullName)
app.get('/api/users/:identifier', async (req, res) => {
  const { identifier } = req.params;

  try {
    console.log("🔎 API hit: /api/users/" + identifier);

    if (!identifier || typeof identifier !== "string") {
      return res.status(400).json({ message: "Invalid identifier" });
    }

    const user = await User.findOne({
      $or: [
        { username: identifier.toLowerCase() },
        { fullName: { $regex: new RegExp(`^${identifier}$`, 'i') } }
      ]
    });

    if (!user) {
      console.log("❌ User not found:", identifier);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ User found:", user.username);
    res.json(user);
  } catch (err) {
    console.error("❌ Server error while fetching user:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// 6) Sign-up Route (POST /sign-up)
app.post('/sign-up', async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Check if a user with that username or email already exists
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user document
    const newUser = new User({
      email,
      username,
      password: hashedPassword,
      fullName: username
    });

    await newUser.save();
    res.status(201).json({ success: true, message: "Sign-up success" });
  } catch (error) {
    console.error("❌ Sign up error:", error);
    res.status(500).json({ success: false, message: "Server error on sign-up" });
  }
});

// 7) Login Route (POST /api/login)
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username (or email if preferred)
    const user = await User.findOne({
      $or: [
        { username: username.toLowerCase() },
        { email: username.toLowerCase() }
      ]
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "❌ User not found" });
    }

    // Compare the given password with the hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "❌ Incorrect password" });
    }

    // Login success
    res.json({ success: true, 
                message: "✅ Login successful",
                actualUsername: user.username });


  } catch (error) {
    console.error("❌ Error processing login:", error);
    res.status(500).json({ success: false, message: "❌ Server error" });
  }
});

// 8) Optional welcome page (GET /)
app.get("/", (req, res) => {
  res.send(`
    <h1>Welcome to the Portfolio API</h1>
    <p>Try visiting a portfolio page like: <a href="/johndoe" target="_blank">http://localhost:3000/johndoe</a></p>
    <p>Or fetch user data directly: <a href="/api/users/johndoe" target="_blank">http://localhost:3000/api/users/johndoe</a></p>
  `);
});

// 9) Non-API Route: Serve portfolio.html for user pages
app.get("/:identifier", (req, res) => {
  const { identifier } = req.params;
  if (identifier.toLowerCase() === "api") {
    return res.status(404).json({ message: "Invalid API request" });
  }
  res.sendFile(path.join(__dirname, "public", "portfolio.html"));
});

const postRoutes = require('./routes/postRoutes');
app.use('/api/posts', postRoutes);


app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
