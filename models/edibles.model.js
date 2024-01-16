const mongoose = require("mongoose");
const Joi = require("joi");

const ediblesSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: {
    category: String,
    categoryId: { type: mongoose.Types.ObjectId, ref: "Category" },
  },
  available: { type: Boolean, default: true },
});

function validateEdibles(edible) {
  const schema = Joi.object({
    name: Joi.string().min(1).max(30).required(),
    price: Joi.number().min(50).max(10000).required(),
    category: Joi.string().min(1).max(25).required(),
  });
  return schema.validate(edible);
}

module.exports.EdiblesInventory = mongoose.model("Edible", ediblesSchema);
module.exports.validate = validateEdibles;
