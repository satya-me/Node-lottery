const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const ticketRoutes = require("./Routes/ticket");
const userRoutes = require("./Routes/User");
const adminRoutes = require("./Routes/Admin/Admin");
const adminHomeRoutes = require("./Routes/Admin/Home");
const testRoutes = require("./Routes/Test");
const configRoutes = require("./Routes/Config");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
// const expressLayout = require('express-ejs-layouts');
const session = require('express-session');

mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.DB_CONNECTION)
  .then(() => {
    console.log("Successfully connected to MongoDB");
    // mongoose.connection.db.listCollections().toArray((err, collections) => {
    //   if (err) throw err;
    //   collections.forEach((collection) => {
    //     console.log(collection.name);
    //   });
    // });
  })
  .catch((err) => {
    console.log("Unable to connect to MongoDB");
    console.error(err);
  });


const app = express();

// Session Impliment
app.use(session({
  secret: 'mysecret',
  resave: false,
  saveUninitialized: false
}));


// Set Templating Engine
// app.use(expressLayout);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "Views"));
// app.set('layout', 'Admin/layout/layout'); // use layout.ejs as the default layout
// app.set('view options', { debug: true });


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "public")));

// User routes
app.use("/api/auth", userRoutes);

// Admin routes
app.use("/api/admin", adminRoutes);
app.use("/admin", adminHomeRoutes);

// Global routes
app.use("/api", configRoutes);
app.use("/api/ticket", ticketRoutes);

// temp test route
app.use("/api/test", testRoutes);

module.exports = app;
