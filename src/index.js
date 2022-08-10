const express = require("express");
const db = require("./config/db");

const app = express();

app.get("/hello", (req, res) => {
  res.send("hello world");
});

const PORT = 8080;

app.listen(PORT, () => {
  db.raw("SELECT 1")
    .then(() => {
      console.log("PostgreSQL connected");
    })
    .catch((err) => {
      console.error(err);
    });

  console.log(`Server listening on port ${PORT}`);
});
