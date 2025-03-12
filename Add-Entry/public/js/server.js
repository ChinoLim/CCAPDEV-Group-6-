const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // Enables JSON body parsing

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/portfolioDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// Define User Schema with Skills & Projects
const userSchema = new mongoose.Schema({
    full_name: String,
    about_desc: String,
    skills: [{ title: String, description: String }],
    projects: [{ title: String, description: String, photo: String }]
});

const User = mongoose.model("User", userSchema, "users");

// API Route to Get All Users
app.get("/api/users", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Start Server with npm
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
