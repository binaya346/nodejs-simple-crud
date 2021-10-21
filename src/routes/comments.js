const { Comment, validateInput } = require("../models/Comment");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

router.get("/", async (req, res) => {
  const comments = await Comment.find().populate("level").populate("parent");
  res.send(comments);
});

router.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("Error 400: Bad Request, Invalid Comment Id");

  const category = await Comment.findById(req.params.id)
    .populate("level")
    .populate("parent");
  if (!category) {
    return res.status(404).send("Comment id not found");
  }
  res.send(category);
});

router.post("/", async (req, res) => {
  const { error } = validateInput(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  postComment(req.body, res);
});

router.put("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("Error 400: Bad Request, Invalid Comment Id");

  const category = await Comment.findById(req.params.id);
});

router.delete("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("Error 400: Bad Request, Invalid Comment Id");

  const category = await Comment.findByIdAndRemove(req.params.id);
  if (!category)
    return res.status(404).send("Error 404: Could not find the Comment id");

  res.send("Successfully deleted the Comment");
});

//Helper functions
const postComment = async (data, res) => {
  const { parent, type, name } = data;
  const parentCategory = await Comment.findById(parent);

  if (!parentCategory && type !== "Main")
    return res.status(404).send("Error 404: Parent Comment Doesn't exist");

  let category;

  category = new Comment({
    name: name,
    type: type,
    parent: type == "Main" ? null : parent,
  });

  try {
    category = await category.save();
  } catch (err) {
    return res.status(400).send(`Error 400: Bad request ${err.errmsg}`);
  }

  return res.send(category);
};

module.exports = router;
