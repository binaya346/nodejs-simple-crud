const express = require("express");
const mongoose = require("mongoose");
const joi = require("joi");
joi.objectId = require("joi-objectid")(joi);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect("mongodb://localhost/quarantine")
  .then(() => console.log("connected to mongodb"))
  .catch(err => console.error("couldn't connect to database"));

const Category = mongoose.model(
  "Category",
  new mongoose.Schema({
    name: {
      type: String,
      unique: true
    },
    level: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CategoryLevel"
    },
    isMainCategory: {
      type: Boolean
    },
    parent: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
      }
    ],
    type: String
  })
);

const validateInput = data => {
  const schema = {
    name: joi
      .string()
      .min(3)
      .max(25)
      .required(),
    level: joi.objectId().required(),
    isMainCategory: joi
      .boolean()
      .strict()
      .required(),
    parent: data.isMainCategory ? joi.optional() : joi.objectId().required()
  };
  return joi.validate(data, schema);
};

module.exports.validateInput = validateInput;
module.exports.Category = Category;
