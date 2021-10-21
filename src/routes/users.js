const { User, validateInput } = require("../models/User");
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const router = express.Router();
require("dotenv").config();
const jwt = require("jsonwebtoken");

// router.get("/", async (req, res) => {
//   const users = await User.find()
//     .populate("first_name")
//     .populate("last_name")
//     .populate("email")
//     .populate("phone")
//     .populate("address")
//     .populate("user_type")
//     .populate("gender")
//     .populate("created_at");
//   res.send(users);
// });

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });

  if (!user) return res.status(400).send("Error: user doesnot exist");

  try {
    if (await bcrypt.compare(password, user.password)) {
      const accessToken = jwt.sign(
        { name: user.email },
        process.env.ACCESS_TOKEN_SECRET
      );
      res.json({ accessToken: accessToken, id: user._id });
    } else {
      res.send("Password didn't match");
    }
  } catch {
    res.status(500).send();
  }
});

router.post("/register", async (req, res) => {
  const { error } = validateInput(req.body);
  const user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already exists");

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  postUser(req.body, res);
});

// router.put("/:id", async (req, res) => {
//   if (!mongoose.Types.ObjectId.isValid(req.params.id))
//     return res.status(400).send("Error 400: Bad Request, Invalid User Id");

//   const post = await User.findById(req.params.id);
//   if (post) {
//     postUser(req.body, res);
//   } else {
//     res.status(404).send("Error 404:Could not find the User id");
//   }
// });

// router.delete("/:id", async (req, res) => {
//   if (!mongoose.Types.ObjectId.isValid(req.params.id))
//     return res.status(400).send("Error 400: Bad Request, Invalid User Id");

//   const post = await User.findByIdAndRemove(req.params.id);
//   if (!post)
//     return res.status(404).send("Error 404: Could not find the User id");

//   res.send("Successfully deleted the User");
// });

//Helper functions
const postUser = async (data, res) => {
  const {
    first_name,
    created_at,
    last_name,
    email,
    phone,
    address,
    gender,
    user_type,
    password,
  } = data;

  let post;

  post = new User({
    first_name,
    created_at,
    last_name,
    email,
    phone,
    address,
    gender,
    user_type,
    password: await bcrypt.hash(password, 10),
  });

  try {
    post = await post.save();
  } catch (err) {
    return res.status(400).send(`Error 400: Bad request ${err.errmsg}`);
  }

  return res.send(post);
};

module.exports = router;
