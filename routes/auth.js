const asyncMiddleware = require("../middlewares/async");
const bcrypt = require("bcrypt");
const express = require("express");
const { User } = require("../models/users.model");
const router = express.Router();

router.post(
  "/",
  asyncMiddleware(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password)
      return res
        .status(400)
        .json({ message: "username and password are required" });

    const user = await User.findOne({
      username: String(username).toLowerCase(),
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ message: "Incorrect password" });

    const token = user.generateAuthToken();

    res.status(200).json({
      message: "Auth successful",
      token,
      user: { username, _id: user._id },
    });
  })
);

module.exports = router;
