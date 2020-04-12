const express = require("express");
const mongoose = require("mongoose");
const categoryLevel = require("./src/routes/categoryLevels");
const category = require("./src/routes/categories");
const author = require("./src/routes/authors");
const app = express();

mongoose
  .connect("mongodb://localhost/quarantine", { useNewUrlParser: true })
  .then(() => console.log("Connected to database"))
  .catch(err => console.error("Could not connect to Mongodb..."));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/api/category-level", categoryLevel);
app.use("/api/category", category);
app.use("/api/author", author);

const port = process.env.port || 3000;
app.listen(port, () => {
  console.log(`listening at port: ${port}`);
});
