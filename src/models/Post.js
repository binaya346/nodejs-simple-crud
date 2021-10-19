const mongoose = require("mongoose");
const joi = require("joi");
joi.objectId = require("joi-objectid")(joi);

const Post = mongoose.model(
  "Post",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
    },
    read_time: {
      type: Number,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      required: true,
    },
  })
);

const validateInput = (data) => {
  const schema = {
    title: joi.string().min(8).max(255).required(),
    created_at: joi.date().default(() => moment().format(), "date created"),
    updated_at: joi.date().default(() => moment().format(), "date updated"),
    read_time: joi.number().required(),
    content: joi.string().required(),
    excerpt: joi.string().required(),
  };
  return joi.validate(data, schema);
};

module.exports.validateInput = validateInput;
module.exports.Post = Post;
