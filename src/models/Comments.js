const mongoose = require("mongoose");
const joi = require("joi");
joi.objectId = require("joi-objectid")(joi);

const Comment = mongoose.model(
  "Comment",
  new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    content: {
      type: String,
      required: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  })
);

const validateInput = (data) => {
  const schema = {
    user: joi.objectId().required(),
    post: joi.objectId().required(),
    content: joi.string().required().min(8),
    created_at: joi.date().default(() => moment().format(), "date created"),
  };
  return joi.validate(data, schema);
};

module.exports.validateInput = validateInput;
module.exports.Comment = Comment;
