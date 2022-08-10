const express = require("express");

const app = express();

app.listen;

app.get("/hello", (req, res) => {
  res.send("hello world");
});

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
