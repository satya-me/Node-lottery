const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const ticketRoutes = require("./Routes/Ticket");
const userRoutes = require("./Routes/User");
const adminRoutes = require("./Routes/Admin/Admin");
const adminHomeRoutes = require("./Routes/Admin/WebRoute");
const testRoutes = require("./Routes/Test");
const configRoutes = require("./Routes/Config");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
// const expressLayout = require('express-ejs-layouts');
const session = require('express-session');
require("dotenv").config();

mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.DB_CONNECTION)
  .then(() => {
    console.log("Successfully connected to MongoDB");
  })
  .catch((err) => {
    console.log("Unable to connect to MongoDB");
    console.error(err);
  });

const app = express();

// Configure the express-session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // set this to true if you're using HTTPS
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
app.use("/", testRoutes);

app.set("port", process.env.PORT || 3303);

const server = http.createServer(app);

server.listen(process.env.PORT || 3303, () => {
  console.log("listening on *:3303");
});
