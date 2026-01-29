const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB (local or Atlas cloud)
mongoose.connect("mongodb://localhost:27017/students");
// Define schema
const studentSchema = new mongoose.Schema({
  name: String,
  regno: String,
  dept: String,
  section: String
});

// Create model
const Student = mongoose.model("Student", studentSchema);

// API route: Save student
app.post("/addStudent", async (req, res) => {
  const { name, regno, dept, section } = req.body;
  const student = new Student({ name, regno, dept, section });
  await student.save();
  res.json({ message: "Student saved successfully!" });
});

// API route: Get all students
app.get("/students", async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

// Start server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});