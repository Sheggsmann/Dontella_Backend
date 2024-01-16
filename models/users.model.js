const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  password: {
    type: String,
  },
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ username: this.username }, process.env.JWT_PRIVATE_KEY);
};

function validateUser(user) {
  const schema = Joi.object({
    username: Joi.string().min(1).max(20).required(),
    password: Joi.string().min(4).max(25).required(),
  });
  return schema.validate(user);
}

module.exports.User = mongoose.model("User", userSchema);
module.exports.validate = validateUser;
