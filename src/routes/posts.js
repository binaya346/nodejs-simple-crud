const { Post, validateInput } = require("../models/Post");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

router.get("/", async (req, res) => {
  const posts = await Post.find()
    .populate("title")
    .populate("created_at")
    .populate("updated_at")
    .populate("read_time")
    .populate("content")
    .populate("excerpt");
  res.send(posts);
});

router.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("Error 400: Bad Request, Invalid Post Id");

  const post = await Post.findById(req.params.id)
    .populate("title")
    .populate("created_at")
    .populate("updated_at")
    .populate("read_time")
    .populate("content")
    .populate("excerpt");

  if (!post) {
    return res.status(404).send("Post id not found");
  }
  res.send(post);
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
    return res.status(400).send("Error 400: Bad Request, Invalid Post Id");

  const post = await Post.findById(req.params.id);
  if (post) {
    postCategory(req.body, res);
  } else {
    res.status(404).send("Error 404:Could not find the Post id");
  }
});

router.delete("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("Error 400: Bad Request, Invalid Post Id");

  const post = await Post.findByIdAndRemove(req.params.id);
  if (!post)
    return res.status(404).send("Error 404: Could not find the Post id");

  res.send("Successfully deleted the Post");
});

//Helper functions
const postCategory = async (data, res) => {
  const { title, created_at, updated_at, read_time, content, excerpt } = data;

  let post;

  post = new Post({
    title,
    created_at,
    updated_at,
    read_time,
    content,
    excerpt,
  });

  try {
    post = await post.save();
  } catch (err) {
    return res.status(400).send(`Error 400: Bad request ${err.errmsg}`);
  }

  return res.send(post);
};

module.exports = router;
