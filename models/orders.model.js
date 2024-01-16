const Joi = require("joi");
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orders: [
      {
        edibles: [
          {
            edible: { type: mongoose.Types.ObjectId, ref: "Edible" },
            quantity: Number,
          },
        ],
      },
    ],
    uuid: String,
    amountToPay: Number,
    completed: { type: Boolean, default: false },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "accepted", "assigned", "completed", "cancelled"],
    },
    user: {
      name: String,
      phoneNumber: String,
      hostelAddress: String,
    },
    deliveryPerson: String,
  },
  { timestamps: true }
);

function validateOrder(order) {
  const edibleItemSchema = Joi.object({
    edible: Joi.string().hex().required(), // Assuming ObjectId is a string of 24 characters
    quantity: Joi.number().integer().min(1).required(),
  });

  const schema = Joi.object({
    orders: Joi.array()
      .items(
        Joi.object({ edibles: Joi.array().items(edibleItemSchema).required() })
      )
      .required(),
    user: Joi.object({
      name: Joi.string().min(1).max(100).required(),
      phoneNumber: Joi.string().min(1).max(15).required(),
      hostelAddress: Joi.string().min(1).max(40).required(),
    }),
    uuid: Joi.string(),
    amountToPay: Joi.number().required(),
    deliveryPerson: Joi.string(),
  });
  return schema.validate(order);
}

module.exports.Order = mongoose.model("Order", orderSchema);
module.exports.validate = validateOrder;
