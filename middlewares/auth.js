const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.headers["x-auth-token"];

  if (!token)
    return res.status(401).json({ message: "Access Denied, No token given" });

  try {
    req.user = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    next();
  } catch (e) {
    res.status(400).json({ message: "Invalid Token" });
  }
};
