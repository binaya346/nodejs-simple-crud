const jwt = require("jsonwebtoken");
const { send } = require("process");
require("dotenv").config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (token == null) return res.status(401).send();

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).send();

    req.user = user;
    next();
  });
};

module.exports.authenticateToken = authenticateToken;
