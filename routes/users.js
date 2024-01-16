const express = require("express");
const bcrypt = require("bcrypt");
const asyncMiddleware = require("../middlewares/async");
const { User, validate: validateUser } = require("../models/users.model");
const router = express.Router();

router.post(
  "/",
  asyncMiddleware(async (req, res) => {
    const { error } = validateUser(req.body);
    if (error)
      return res.status(422).json({ message: error.details[0].message });

    const { username, password } = req.body;

    let user = await User.findOne({ username: String(username).toLowerCase() });
    if (user) return res.status(400).json({ message: "User already exists" });

    user = new User({ username: String(username).toLowerCase() });

    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.status(200).json({ message: "User created successfully" });
  })
);

module.exports = router;
