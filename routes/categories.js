const express = require("express");
const asyncMiddleware = require("../middlewares/async");
const { validate, Category } = require("../models/category.models");
const authMiddleware = require("../middlewares/auth");
const router = express.Router();

router.post(
  "/",
  authMiddleware,
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error)
      return res.status(422).json({ message: error.details[0].message });

    let { name } = req.body;
    name = String(name).toLowerCase();

    const exists = await Category.findOne({ name });
    if (exists)
      return res.status(400).json({ message: "Category already exists" });

    const category = await Category.create({ name });

    res
      .status(200)
      .json({ message: "Category created successfully", category });
  })
);

router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const categories = await Category.find({});
    res.status(200).json({ message: "categories", categories });
  })
);

module.exports = router;
