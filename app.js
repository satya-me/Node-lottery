const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ticketRoutes = require("./Routes/ticket");
const userRoutes = require("./Routes/User");
const adminRoutes = require("./Routes/Admin/Admin");
const testRoutes = require("./Routes/Test");
const configRoutes = require("./Routes/Config");
const path = require("path");
const cors = require("cors");


mongoose.set("strictQuery", true);
mongoose
  .connect("mongodb://127.0.0.1:27017/v1?retryWrites=true&w=majority")
  .then(() => {
    console.log("Successfully connected to MongoDB");
  })
  .catch((err) => {
    console.log("Unable to connect to MongoDB");
    console.error(err);
  });

const app = express();
app.use(cors());
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join(__dirname, "images")));

// User routes
app.use("/api/auth", userRoutes);

// Admin routes
app.use("/api/admin", adminRoutes);

// Global routes
app.use("/api", configRoutes);
app.use("/api/ticket", ticketRoutes);

// temp test route
app.use("/api/test", testRoutes);

module.exports = app;
