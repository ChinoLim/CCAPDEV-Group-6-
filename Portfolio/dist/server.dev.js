"use strict";

var express = require("express");

var mongoose = require("mongoose");

var cors = require("cors");

var path = require("path");

var app = express();
var PORT = 3000;
app.use(cors());
app.use(express.json());
app.use(express["static"](path.join(__dirname, "public")));
var MONGO_URI = "mongodb://localhost:27017/grp6_portfolio";
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(function () {
  return console.log("MongoDB connected");
})["catch"](function (err) {
  return console.error("MongoDB connection error:", err);
});
var userSchema = new mongoose.Schema({
  name: String,
  username: String,
  email: String,
  phone_number: String,
  profile_img: String,
  about_text: String,
  skills: [{
    name: String,
    description: String
  }],
  projects: [{
    title: String,
    description: String,
    image: String
  }]
});
var User = mongoose.model("User", userSchema, "users");
app.get("/api/users/:identifier", function _callee(req, res) {
  var identifier, user;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          identifier = req.params.identifier;
          console.log("\uD83D\uDD0D Searching for user: ".concat(identifier));
          _context.prev = 2;
          _context.next = 5;
          return regeneratorRuntime.awrap(User.findOne({
            $or: [{
              name: identifier
            }, {
              username: identifier.toLowerCase()
            }]
          }));

        case 5:
          user = _context.sent;

          if (user) {
            _context.next = 9;
            break;
          }

          console.log("User not found");
          return _context.abrupt("return", res.status(404).json({
            message: "User not found"
          }));

        case 9:
          console.log("User found:", user);
          res.json(user);
          _context.next = 17;
          break;

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](2);
          console.error("Error:", _context.t0);
          res.status(500).json({
            message: "Server error"
          });

        case 17:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[2, 13]]);
});
app.get("/:identifier", function (req, res) {
  if (req.params.identifier === "api") {
    return res.status(404).json({
      message: "Invalid API request"
    });
  }

  res.sendFile(path.join(__dirname, "public", "portfolio.html"));
});
app.get("/", function (req, res) {
  res.send("\n      <h1>Welcome to the Portfolio API</h1>\n      <p>Try visiting a portfolio page like: <a href=\"/josh_smith\" target=\"_blank\">http://localhost:3000/josh_smith</a></p>\n      <p>Or fetch user data directly: <a href=\"/api/users/josh_smith\" target=\"_blank\">http://localhost:3000/api/users/josh_smith</a></p>\n  ");
});
app.listen(PORT, function () {
  console.log("Server running at http://localhost:".concat(PORT));
});