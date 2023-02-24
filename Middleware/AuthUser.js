const jwt = require("jsonwebtoken");
// const net = require("net");
// const os = require("os");

module.exports = (req, res, next) => {
  // const clientIp = net.isIPv4(req.connection.remoteAddress)
  //   ? req.connection.remoteAddress.split(":").pop()
  //   : req.connection.remoteAddress.substr(7);
  // console.log(
  //   "Request from IP is " + clientIp + ":" + req.headers.host.split(":").pop()
  // );

  // console.log(os.hostname());
  console.table({ "Calling Route ": req.route.path });
  const token = req.headers.authorization.split(" ")[1];

  // console.log("From Auth ", req.headers);
  try {
    const deCodeToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const userId = deCodeToken.userId;
    req.auth = { userId };
    if (req.body.userId && req.body.userId !== userId) {
      throw "Invalid User ID: " + userId;
    } else {
      next();
    }
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      // handle the expired token error
      console.table({
        error: "token expired",
        message: "please login",
      });
      res.status(401).json({
        error: "token expired",
        message: "please login",
      });
    } else {
      // handle other errors
      res.status(401).json({
        error: "Invalid request",
      });
    }
  }
};
