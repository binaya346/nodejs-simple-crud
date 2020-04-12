const { Category, validateInput } = require("../models/Category");
const { CategoryLevel } = require("../models/CategoryLevel");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

router.get("/", async (req, res) => {
  const categories = await Category.find().populate("level").populate("parent");
  res.send(categories);
});

router.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("Error 400: Bad Request, Invalid Category Id");

  const category = await Category.findById(req.params.id)
    .populate("level")
    .populate("parent");
  if (!category) {
    return res.status(404).send("Category id not found");
  }
  res.send(category);
});

router.post("/", async (req, res) => {
  const { error } = validateInput(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  postCategory(req.body, res);
});

router.put("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("Error 400: Bad Request, Invalid Category Id");

  const category = await Category.findById(req.params.id);
});

router.delete("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("Error 400: Bad Request, Invalid Category Id");

  const category = await Category.findByIdAndRemove(req.params.id);
  if (!category)
    return res.status(404).send("Error 404: Could not find the Category id");

  res.send("Successfully deleted the Category");
});

//Helper functions
const postCategory = async (data, res) => {
  const { level, parent, type, name } = data;
  const categoryLevel = await CategoryLevel.findById(level);
  const parentCategory = await Category.findById(parent);

  if (!categoryLevel)
    return res.status(404).send("Error: Invalid Category Level!");
  if (!parentCategory && type !== "Main")
    return res.status(404).send("Error 404: Parent Category Doesn't exist");

  let category;

  if (
    (categoryLevel.level === "First" && type === "Main") ||
    (categoryLevel.level !== "First" && type !== "Main")
  ) {
    category = new Category({
      name: name,
      level: level,
      type: type,
      parent: type == "Main" ? null : parent,
    });

    try {
      category = await category.save();
    } catch (err) {
      return res.status(400).send(`Error 400: Bad request ${err.errmsg}`);
    }
  } else {
    return res
      .status(400)
      .send("Error 400: Category level and Category Type are incompatible");
  }
  return res.send(`Successfully added category ${category}`);
};

module.exports = router;
