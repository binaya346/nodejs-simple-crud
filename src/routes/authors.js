const express = require("express");
const router = express.Router();
const { Author, validateInput } = require("../models/Author");
const mongoose = require("mongoose");

router.get("/", async (req, res) => {
  const authors = await Author.find();

  res.send(authors);
});

router.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("Error 400: Bad Request, Invalid Author Id");

  const author = await Author.findById(req.params.id);
  if (!author) return res.status(404).send("Error 404: Author not found");

  res.send(author);
});

router.post("/", async (req, res) => {
  const { error } = validateInput(req.body);
  if (error)
    return res.status(400).send(`Error 400: ${error.details[0].message}`);

  const { name, email, phone, address, gender } = req.body;

  let author = new Author({
    name: name,
    email: email,
    phone: phone,
    address: address,
    gender: gender
  });
  try {
    author = await author.save();
  } catch (err) {
    return res.status(400).send(`Error 400: Bad request ${err.errmsg}`);
  }
  res.send(author);
});

router.put("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("Error 400: Bad Request, Invalid Author Id");

  const { error } = validateInput(req.body);
  if (error)
    return res
      .status(400)
      .send(`Error 400: Bad request ${error.details[0].message}`);

  const { name, email, phone, address, gender } = req.body;

  const author = await Author.findByIdAndUpdate(
    req.params.id,
    {
      name: name,
      email: email,
      phone: phone,
      address: address,
      gender: gender
    },
    { new: true }
  );
  if (!author) return res.status(404).send("Author not found");

  res.send("Successfully updated the Author");
});

router.delete("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("Error 400: Bad Request, Invalid Author Id");

  const author = await Author.findByIdAndRemove(req.params.id);
  if (!author)
    return res.status(404).send("Error 404: Could not find the Author id");

  res.send("Successfully Deleted the Author");
});

module.exports = router;
