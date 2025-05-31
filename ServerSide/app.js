const express = require("express");
// const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const studentRoutes = require("./Routes/studentRoutes");
const branchRoutes = require("./Routes/branchRoutes");
const semesterRoutes = require("./Routes/semesterRoutes");

const app = express();
const port = 4444;

// app.use(express.static(path.join(__dirname, "/public")));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// API Routes
app.use("/api/students", studentRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/semesters", semesterRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("AcadView Server is running");
});

mongoose.connect("mongodb://localhost:27017/Acadview")
  .then(() => {
    app.listen(port, () =>
      console.log(`Server started at http://localhost:${port}`)
    );
    console.log("MongoDB connected successfully");
  })
  .catch((error) => console.error("MongoDB connection error:", error));

module.exports = app;
