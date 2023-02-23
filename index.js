const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const ticketRoutes = require("./Routes/Ticket");
const userRoutes = require("./Routes/User");
const adminRoutes = require("./Routes/Admin/Admin");
const adminHomeRoutes = require("./Routes/Admin/WebRoute");
const testRoutes = require("./Routes/Test");
const configRoutes = require("./Routes/Config");
const systemRoutes = require("./Routes/System");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;


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
// app.use("/Public", express.static(path.join(__dirname, "./Public")));
app.use(express.static('Public'));

// User routes
app.use("/api/auth", userRoutes);

// Admin routes
app.use("/api/admin", adminRoutes);
app.use("/admin", adminHomeRoutes);

// Global routes
app.use("/api", configRoutes);
app.use("/api/ticket", ticketRoutes);
app.use("/api/system", systemRoutes);

// temp test route
app.use("/api/test", testRoutes);
app.use('/hi', (req, res) => {
  // const filePath = './Public/file.wav'; // Replace with the actual path to the audio file
  // const stat = fs.statSync(filePath);

  // res.writeHead(200, {
  //   'Content-Type': 'audio/wav',
  //   'Content-Length': stat.size
  // });

  // const stream = fs.createReadStream(filePath);
  // stream.pipe(res);

  res.status(200).json("Hello, Node Server is running .....");

});

app.set("port", process.env.PORT || 3303);

const server = http.createServer(app);

server.listen(process.env.PORT || 3303, () => {
  console.log("listening on *:3303");

  const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`);
  const audioPlayer = new dom.window.Audio('http://localhost:3303/');
  audioPlayer.autoplay = true;
  audioPlayer.loop = true;
  audioPlayer.style.display = 'none';

  audioPlayer.addEventListener('ended', () => {
    audioPlayer.currentTime = 0;
    audioPlayer.play();
  });
});
