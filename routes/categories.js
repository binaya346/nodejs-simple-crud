const { Category, validateInput } = require("../models/Category");
const { CategoryLevel } = require("../models/CategoryLevel");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const categories = await Category.find()
    .populate("level")
    .populate("parent");
  res.send(categories);
});

router.get("/:id", async (req, res) => {
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
  const categoryLevel = await CategoryLevel.findById(req.body.level);
  const parentCategory = await Category.findById(req.body.parent);

  if (!categoryLevel)
    return res.status(404).send("Error: Invalid Category Level!");
  if (!parentCategory)
    return res.status(404).send("Error: Parent Category Doesn't exist");

  let category;

  if (
    (categoryLevel.level === "First" && req.body.isMainCategory) ||
    (categoryLevel.level !== "First" && !req.body.isMainCategory)
  ) {
    category = new Category({
      name: req.body.name,
      level: req.body.level,
      isMainCategory: req.body.isMainCategory,
      parent: req.body.isMainCategory ? null : req.body.parent,
      type: req.body.isMainCategory ? "Main" : "Sub"
    });
    try {
      category = await category.save();
    } catch (err) {
      return res.status(400).send(`Error: Bad request ${err.errmsg}`);
    }
  } else {
    console.log(categoryLevel.level !== "First");
    return res
      .status(400)
      .send("Error: Category level and isMainCategory are incompatible");
  }
  res.send(category);
});

module.exports = router;
