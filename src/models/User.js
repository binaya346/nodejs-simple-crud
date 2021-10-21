const mongoose = require("mongoose");
const joi = require("joi");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    phone: {
      type: String,
      unique: true,
    },
    address: {
      type: String,
    },
    gender: {
      type: String,
    },
    user_type: {
      type: String,
      required: true,
    },
    created_at: {
      type: Date,
      default: Date.now(),
    },
  })
);

const validateInput = (data) => {
  const schema = {
    first_name: joi.string().required().min(3).max(50),
    last_name: joi.string().required().min(3).max(50),
    email: joi.string().email().required().min(5).max(225),
    phone: joi.string().min(10).max(15).optional(),
    address: joi.string().min(3).max(225).optional(),
    gender: joi.string().valid("Male", "Female", "other").required(),
    user_type: joi.string().valid("admin", "editor", "user").required(),
    created_at: joi.date(),
    password: joi.string().required(),
  };
  return joi.validate(data, schema);
};

module.exports.User = User;
module.exports.validateInput = validateInput;
