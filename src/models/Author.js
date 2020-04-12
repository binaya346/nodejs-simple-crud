const mongoose = require("mongoose");
const joi = require("joi");

const Author = mongoose.model(
  "Author",
  new mongoose.Schema({
    name: {
      type: String
    },
    email: {
      type: String,
      unique: true
    },
    phone: {
      type: String,
      unique: true
    },
    address: {
      type: String
    },
    gender: {
      type: String
    }
  })
);

const validateInput = data => {
  const schema = {
    name: joi
      .string()
      .required()
      .min(3)
      .max(50),
    email: joi
      .string()
      .email()
      .required()
      .min(5)
      .max(225),
    phone: joi
      .string()
      .min(10)
      .max(15)
      .required(),
    address: joi
      .string()
      .min(3)
      .max(225)
      .optional(),
    gender: joi
      .string()
      .valid("Male", "Female", "other")
      .required()
  };
  return joi.validate(data, schema);
};

module.exports.Author = Author;
module.exports.validateInput = validateInput;
