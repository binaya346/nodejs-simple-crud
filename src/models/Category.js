const mongoose = require("mongoose");
const joi = require("joi");
joi.objectId = require("joi-objectid")(joi);

const Category = mongoose.model(
  "Category",
  new mongoose.Schema({
    name: {
      type: String,
      unique: true,
    },
    parent: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    type: String,
  })
);

const validateInput = (data) => {
  const schema = {
    name: joi.string().min(3).max(25).required(),
    type: joi.string().valid("Main", "Sub").required(),
    parent: data.type === "Main" ? joi.optional() : joi.objectId().required(),
  };
  return joi.validate(data, schema);
};

module.exports.validateInput = validateInput;
module.exports.Category = Category;
