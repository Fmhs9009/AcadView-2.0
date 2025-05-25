const express = require("express");
// const path = require("path");
const mongoose = require("mongoose");
// const router = require("./router/router");
const cors = require("cors");

const app = express();
const port = 4444;

// app.use(express.static(path.join(__dirname, "/public")));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", (req, res) => {
  res.send("Server is running");
});

mongoose.connect("mongodb://localhost:27017/Acadview")
  .then(() => {
    app.listen(port, () =>
      console.log("Server started at http://localhost:4444")
    );
  })
  .catch((error) => console.error("MongoDB connection error:", error));
