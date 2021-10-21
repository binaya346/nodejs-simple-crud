const express = require("express");
const mongoose = require("mongoose");
const category = require("./src/routes/categories");
const author = require("./src/routes/authors");
const user = require("./src/routes/users");
const app = express();
const cors = require("cors");

mongoose
  .connect("mongodb://localhost/quarantine", { useNewUrlParser: true })
  .then(() => console.log("Connected to database"))
  .catch((err) => console.error("Could not connect to Mongodb..."));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(cors());
app.use("/api/category", category);
app.use("/api/author", author);
app.use("/api/users", user);

const port = process.env.port || 5000;
app.listen(port, () => {
  console.log(`listening at port: ${port}`);
});
