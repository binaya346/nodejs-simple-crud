const mongoose = require("mongoose");
const joi = require("joi");

const CategoryLevel = mongoose.model(
  "CategoryLevel",
  new mongoose.Schema({
    level: {
      type: String,
      unique: true
    },
    name: {
      type: String,
      unique: true
    }
  })
);
const validateInput = data => {
  const schema = {
    level: joi.string().required(),
    name:
      data.level === "First"
        ? joi
            .string()
            .valid("Main Category")
            .required()
        : joi
            .string()
            .valid("Sub Category")
            .required()
  };
  return joi.validate(data, schema);
};

module.exports.CategoryLevel = CategoryLevel;
module.exports.validateInput = validateInput;
