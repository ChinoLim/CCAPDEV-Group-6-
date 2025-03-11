const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); 

const MONGO_URI = "mongodb://localhost:27017/grp6_portfolio";
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  email: String,
  phone_number: String,
  profile_img: String,
  about_text: String,
  skills: [{ name: String, description: String }],
  projects: [{ title: String, description: String, image: String }]
});

const User = mongoose.model("User", userSchema, "users");

app.get("/api/users/:identifier", async (req, res) => {
  const identifier = req.params.identifier;
  console.log(`🔍 Searching for user: ${identifier}`);

  try {
    const user = await User.findOne({
      $or: [{ name: identifier }, { username: identifier.toLowerCase() }]
    });

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User found:", user);
    res.json(user);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/:identifier", (req, res) => {
  if (req.params.identifier === "api") {
    return res.status(404).json({ message: "Invalid API request" });
  }
  res.sendFile(path.join(__dirname, "public", "portfolio.html"));
});

app.get("/", (req, res) => {
  res.send(`
      <h1>Welcome to the Portfolio API</h1>
      <p>Try visiting a portfolio page like: <a href="/josh_smith" target="_blank">http://localhost:3000/josh_smith</a></p>
      <p>Or fetch user data directly: <a href="/api/users/josh_smith" target="_blank">http://localhost:3000/api/users/josh_smith</a></p>
  `);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
