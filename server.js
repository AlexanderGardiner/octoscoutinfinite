const express = require("express");
const path = require("path");
const app = express();
const fs = require("fs");
const fileLock = require("proper-lockfile");
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

app.post("/submitData", async (req, res) => {
  console.log(req.body);
  await writeDataToJSON(req.body);
  res.sendStatus(200);
});

const PORT = 9084;
app.listen(PORT, () => {
  console.log("App is listening on port 9084");
});

async function writeDataToJSON(data) {
  let filePath = "./public/output.json";
  data.timestamp = new Date();
  const lockfilePath = filePath + ".lock";

  try {
    await fileLock.lock(lockfilePath);
    const fileContent = fs.readFileSync(filePath, "utf8");
    const jsonData = JSON.parse(fileContent || "[]");
    jsonData.push(data);
    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
    console.log("Data appended to output.json.");
  } catch (err) {
    console.error("Error writing to output.json:", err);
  } finally {
    await fileLock.unlock(lockfilePath);
  }
}
