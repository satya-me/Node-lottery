const jwt = require("jsonwebtoken");
const net = require("net");
const os = require('os');

module.exports = (req, res, next) => {
  const clientIp = net.isIPv4(req.connection.remoteAddress)
    ? req.connection.remoteAddress.split(":").pop()
    : req.connection.remoteAddress.substr(7);
  console.log(
    "Request from IP is " + clientIp + ":" + req.headers.host.split(":").pop()
  );
  
// console.log(os.hostname());
  console.log("Calling Route ", req.route.path);
  const token = req.headers.authorization.split(" ")[1];
  const deCodeToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
  const userId = deCodeToken.userId;
  // console.log("From Auth ", req.headers);
  try {
    req.auth = { userId };
    if (req.body.userId && req.body.userId !== userId) {
      throw "Invalid User ID: " + userId;
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({
      error: "Invalid request",
    });
  }
};
