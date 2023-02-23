const jwt = require("jsonwebtoken");
// const store = require("store");

module.exports = (req, res, next) => {
  //   console.log(store);
  try {
    const token = req.headers.authorization.split(" ")[1];
    const deCodeToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const userId = deCodeToken.userId;
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