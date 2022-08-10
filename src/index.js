const express = require("express");

const app = express();

app.get("/hello", (req, res) => {
  res.send("hello world");
});

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
