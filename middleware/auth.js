const jwt = require("jsonwebtoken");
require('dotenv/config')
const auth = (req, res, next) => {
  const token = req.header("x-auth-token");
console.log(process.env.JWT_KEY ,token, "process.env.JWT_KEY")
  // Check for token
  if (!token)
    return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    // Add user from payload
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ msg: "Token is not valid" });
  }
};

module.exports = auth;