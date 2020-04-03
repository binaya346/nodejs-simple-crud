const express = require("express");
const { CategoryLevel, validateInput } = require("../models/CategoryLevel");
const router = express.Router();

router.get("/", async (req, res) => {
  const categoryLevels = await CategoryLevel.find().sort({ level: 1 });
  res.send(categoryLevels);
});

router.get("/:id", async (req, res) => {
  const categoryLevel = await CategoryLevel.findById(req.params.id).select(
    "categoryLevel"
  );
  if (!categoryLevel) {
    return res
      .status(404)
      .send("Error: The given level of category is not available");
  }
  res.send(categoryLevel);
});

router.post("/", async (req, res) => {
  const { error } = validateInput(req.body);
  if (error) {
    return res
      .status(400)
      .send(`Error: Bad request ${error.details[0].message}`);
  }

  let categoryLevel = new CategoryLevel({
    level: req.body.level,
    name: req.body.name
  });

  try {
    categoryLevel = await categoryLevel.save();
  } catch (err) {
    return res.status(400).send(`Error: Bad request ${err.errmsg}`);
  }
  res.send(categoryLevel);
});
module.exports = router;
