const express = require("express");
const asyncMiddleware = require("../middlewares/async");
const authMiddleware = require("../middlewares/auth");
const {
  EdiblesInventory,
  validate: validateEdible,
} = require("../models/edibles.model");
const { Category } = require("../models/category.models");
const router = express.Router();

router.post(
  "/",
  authMiddleware,
  asyncMiddleware(async (req, res) => {
    const { error } = validateEdible(req.body);
    if (error)
      return res.status(422).json({ message: error.details[0].message });

    let { name, price, category } = req.body;
    name = String(name).toLowerCase();
    category = String(category).toLowerCase();

    const exists = await EdiblesInventory.findOne({ name });
    if (exists) return res.status(400).json({ message: "Already exists" });

    const categoryDocument = await Category.findOne({ name: category });
    if (!categoryDocument)
      return res.status(400).json({ message: "Invalid category" });

    const edible = await EdiblesInventory.create({
      name,
      price,
      category: { category, categoryId: categoryDocument._id },
    });

    return res
      .status(200)
      .json({ message: "Edible created successfully", edible });
  })
);

router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const edibles = await EdiblesInventory.find({ available: true });
    res.status(200).json({ message: "edibles", edibles });
  })
);

router.get(
  "/client",
  authMiddleware,
  asyncMiddleware(async (req, res) => {
    const categories = await Category.find();
    const edibles = await EdiblesInventory.find();
    res.status(200).json({ message: "edibles", edibles, categories });
  })
);

router.put(
  "/:edibleId/toggle",
  authMiddleware,
  asyncMiddleware(async (req, res) => {
    const edible = await EdiblesInventory.findOne({ _id: req.params.edibleId });
    if (!edible) return res.status(400).json({ message: "Edible not found" });

    await EdiblesInventory.updateOne(
      { _id: edible._id },
      { $set: { available: !edible.available } }
    );

    res.status(200).json({ message: "Edible Toggled", edible });
  })
);

module.exports = router;
