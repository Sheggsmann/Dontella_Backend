const mongoose = require("mongoose");
const Joi = require("joi");

const categorySchema = new mongoose.Schema({
  name: String,
});

function validateCategory(category) {
  const schema = Joi.object({ name: Joi.string().min(1).max(30).required() });
  return schema.validate(category);
}

module.exports.Category = mongoose.model("Category", categorySchema);
module.exports.validate = validateCategory;
