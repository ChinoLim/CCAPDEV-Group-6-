// model/user.js
const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String }
}, { _id: true }); // ensures skills have _id

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  photo: { type: String }
}, { _id: true }); // ensures projects have _id


const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone:    { type: String },
  profile_img: { type: String },
  about_desc:  { type: String },
  skills: [skillSchema],
  projects: [projectSchema]
});

module.exports = mongoose.model('User', userSchema);
