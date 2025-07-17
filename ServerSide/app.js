const express = require("express");
// const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const studentRoutes = require("./Routes/studentRoutes");
const branchRoutes = require("./Routes/branchRoutes");
const semesterRoutes = require("./Routes/semesterRoutes");
const facultyRoutes = require("./Routes/facultyRoutes");
const subjectRoutes = require("./Routes/subjectRoutes");
const adminRoutes = require("./Routes/adminRoutes");
const hodRoutes = require("./Routes/hodRoutes");
const hodManagementRoutes = require("./Routes/hodManagement");
const assignmentRoutes = require("./Routes/assignmentRoutes");
const timetableRoutes = require("./Routes/timetableRoutes");
const classRoutes = require("./Routes/classRoutes");
const studyMaterialRoutes = require("./Routes/studyMaterialRoutes");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// app.use(express.static(path.join(__dirname, "/public")));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// API Routes
app.use("/api/students", studentRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/semesters", semesterRoutes);
app.use("/api/faculties", facultyRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/hods", hodRoutes);
app.use("/api/hod-management", hodManagementRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/timetables", timetableRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/study-materials", studyMaterialRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("AcadView Server is running");
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(port, () =>
      console.log(`Server started at http://localhost:${port}`)
    );
    console.log("MongoDB connected successfully");
  })
  .catch((error) => console.error("MongoDB connection error:", error));

module.exports = app;
