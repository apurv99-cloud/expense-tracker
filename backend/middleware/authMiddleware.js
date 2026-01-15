const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "Not authorized, no token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach only the user ID
    req.user = { id: decoded.id };

    next();
  } catch (err) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
