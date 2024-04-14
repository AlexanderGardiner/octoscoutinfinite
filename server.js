const express = require("express");
const path = require("path");
const app = express();
const fs = require("fs");
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

app.post("/submitData", (req, res) => {
  console.log(req.body);
  res.status(200);
  res.send();
});
const PORT = 9084;
app.listen(PORT, () => {
  console.log("App is listening on port 9084");
});
