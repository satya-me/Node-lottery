const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
// const stuffRoutes = require("./routes/thing");
const userRoutes = require("./Routes/User");
const path = require("path");
const cors = require("cors");

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
app.use("/images", express.static(path.join(__dirname, "images")));

// app.use("/api/stuff", stuffRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;

// app.use((req, res, next) => {
//   console.log(res.authorization);
//   res.setHeader(
//     "Access-Control-Allow-Origin",
//     "*",
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization",
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, DELETE, PATCH, OPTIONS"
//   );
//   next();
// });
