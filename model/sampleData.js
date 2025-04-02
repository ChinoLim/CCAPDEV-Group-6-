const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./user');

const saltRounds = 10;


// Connect to MongoDB
mongoose.connect(
  'mongodb+srv://matthewyoung:Portfolio123@cluster0.v2tmivo.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Cluster0',
  { useNewUrlParser: true, useUnifiedTopology: true }
);



const sampleUsers = [
  {
    fullName: "John Doe",
    username: "johndoe",
    email: "john@example.com",
    phone: "123-456-7890",
    profile_img: "images/john.jpg",
    about_desc: "Full-stack web developer with a passion for clean code.",
    skills: [
      { _id: new mongoose.Types.ObjectId(), title: "JavaScript", description: "Experienced in ES6+ and Node.js" },
      { _id: new mongoose.Types.ObjectId(), title: "React", description: "Building interactive UI" }
    ],
    projects: [
      { _id: new mongoose.Types.ObjectId(), title: "Portfolio Website", description: "My personal portfolio site", photo: "images/portfolio1.jpg" }
    ]
  },
  {
    fullName: "Jane Smith",
    username: "janesmith",
    email: "jane@example.com",
    phone: "987-654-3210",
    profile_img: "images/jane.jpg",
    about_desc: "Front-end developer who loves creating user-friendly interfaces.",
    skills: [
      { _id: new mongoose.Types.ObjectId(), title: "HTML/CSS", description: "Responsive design" },
      { _id: new mongoose.Types.ObjectId(), title: "Vue.js", description: "Dynamic and modern web apps" }
    ],
    projects: [
      { _id: new mongoose.Types.ObjectId(), title: "E-commerce UI", description: "Redesigned the shopping experience", photo: "images/portfolio2.jpg" }
    ]
  },
  {
    fullName: "Alice Johnson",
    username: "alicej",
    email: "alice@example.com",
    phone: "555-123-4567",
    profile_img: "images/alice.jpg",
    about_desc: "Back-end developer with expertise in RESTful APIs and database design.",
    skills: [
      { _id: new mongoose.Types.ObjectId(), title: "Node.js", description: "Server-side JavaScript" },
      { _id: new mongoose.Types.ObjectId(), title: "MongoDB", description: "NoSQL database design" }
    ],
    projects: [
      { _id: new mongoose.Types.ObjectId(), title: "API Service", description: "Robust RESTful API service", photo: "images/portfolio3.jpg" }
    ]
  },
  {
    fullName: "Bob Lee",
    username: "boblee",
    email: "bob@example.com",
    phone: "444-555-6666",
    profile_img: "images/bob.jpg",
    about_desc: "DevOps engineer turning ideas into production.",
    skills: [
      { _id: new mongoose.Types.ObjectId(), title: "Docker", description: "Containerization for scalable apps" },
      { _id: new mongoose.Types.ObjectId(), title: "AWS", description: "Cloud services and deployments" }
    ],
    projects: [
      { _id: new mongoose.Types.ObjectId(), title: "CI/CD Pipeline", description: "Automated deployments", photo: "images/portfolio4.jpg" }
    ]
  },
  {
    fullName: "Charlie Kim",
    username: "charliek",
    email: "charlie@example.com",
    phone: "777-888-9999",
    profile_img: "images/charlie.jpg",
    about_desc: "Creative developer blending design and functionality.",
    skills: [
      { _id: new mongoose.Types.ObjectId(), title: "Python", description: "Automation and scripting" },
      { _id: new mongoose.Types.ObjectId(), title: "Django", description: "Rapid web development" }
    ],
    projects: [
      { _id: new mongoose.Types.ObjectId(), title: "Blog Platform", description: "A full-featured blogging website", photo: "images/portfolio5.jpg" }
    ]
  }
];

// Hash the password for each user before inserting
sampleUsers.forEach(user => {
  // Hash "password123" using bcrypt
  user.password = bcrypt.hashSync("password123", saltRounds);
});

async function seedUsers() {
    try {
      await User.deleteMany({});
      await User.insertMany(sampleUsers);
      console.log("✅ Sample users inserted with hashed passwords");
    } catch (error) {
      console.error("❌ Error seeding users:", error);
    }
  }
  
  // ✅ Export seedUsers correctly
  module.exports = seedUsers;
  
  if (require.main === module) {
    seedUsers().then(() => {
      console.log("🌱 Done seeding. Exiting.");
      process.exit();
    });
  }
  
