const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGO_URI = 'mongodb://localhost:27017/';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define schemas and models
const skillSchema = new mongoose.Schema({
  title: String,
  description: String,
});

const projectSchema = new mongoose.Schema({
  photo: String,
  title: String,
  description: String,
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  full_name: String,
  about_desc: String,
  facebook_profile: String,
  email: String,
  phone_number: String,
  skills: [skillSchema],
  projects: [projectSchema],
});

const User = mongoose.model('User', userSchema);

// API routes
app.get('/api/users/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
