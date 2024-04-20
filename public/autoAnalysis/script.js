import { getJSONOutput } from "/util.js";
let JSONOutput = await getJSONOutput();

// Parse JSON strings in data
const parsedJSONOutput = JSONOutput.map((item) => {
  const parsedItem = { ...item };
  Object.keys(item).forEach((key) => {
    try {
      parsedItem[key] = JSON.parse(item[key]);
    } catch (error) {
      // Ignore if it's not a JSON string
    }
  });
  return parsedItem;
});

let queryString = window.location.search;

let urlParams = new URLSearchParams(queryString);
let teamNumber = urlParams.get("team");
let fieldWidth = 8.2;
let fieldHeight = 16.5;
let fieldSizeMultiplier = 50;
let gamePieceDimension = 1;
let gamePieceBoxDimension = 1.4;

// Function to draw a graph to the screen
function drawAutoPath(pieces, matchNumber) {
  let canvasTitle = document.createElement("h1");
  canvasTitle.innerHTML = matchNumber;
  canvasTitle.classList.add("canvasTitle");
  let canvasDiv = document.createElement("div");
  canvasDiv.classList.add("autoCanvasContainer");
  canvasDiv.appendChild(canvasTitle);
  canvasContainer.appendChild(canvasDiv);

  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");
  canvas.classList.add("autoCanvas");
  canvas.style.height = fieldHeight * fieldSizeMultiplier + "px";
  canvas.style.width = fieldWidth * fieldSizeMultiplier + "px";
  canvas.height = fieldHeight * fieldSizeMultiplier;
  canvas.width = fieldWidth * fieldSizeMultiplier;
  ctx.font = "bold 12px serif";
  ctx.textAlign = "center";
  ctx.lineWidth = 15;

  ctx.drawImage(
    document.getElementById("fieldImage"),
    0,
    0,
    fieldWidth * fieldSizeMultiplier,
    fieldHeight * fieldSizeMultiplier
  );
  canvasDiv.appendChild(canvas);

  let iteratorColorStartingValue = 100;
  let colorIterator = iteratorColorStartingValue;
  let maxColorIteratorValue = 255;
  for (let i = 0; i < pieces.length - 1; i++) {
    ctx.strokeStyle =
      "rgb(" +
      [0, (colorIterator - iteratorColorStartingValue) / 2, colorIterator].join(
        ","
      ) +
      ")";
    colorIterator +=
      (maxColorIteratorValue - iteratorColorStartingValue) /
      (pieces.length - 1);
    ctx.beginPath();
    ctx.moveTo(
      pieces[i].collectionLocation.y * fieldSizeMultiplier,
      pieces[i].collectionLocation.x * fieldSizeMultiplier
    );
    ctx.lineTo(
      pieces[i + 1].collectionLocation.y * fieldSizeMultiplier,
      pieces[i + 1].collectionLocation.x * fieldSizeMultiplier
    );
    ctx.stroke();
  }
  for (let i = 0; i < pieces.length; i++) {
    let img = new Image();
    img.src = "../images/" + pieces[i].name + ".png";
    img.onload = function () {
      ctx.fillStyle = "#bb9839";

      ctx.fillRect(
        (pieces[i].collectionLocation.y - gamePieceBoxDimension / 2) *
          fieldSizeMultiplier,
        (pieces[i].collectionLocation.x - gamePieceBoxDimension / 2) *
          fieldSizeMultiplier,
        gamePieceBoxDimension * fieldSizeMultiplier,
        gamePieceBoxDimension * fieldSizeMultiplier
      );
      ctx.drawImage(
        img,
        (pieces[i].collectionLocation.y - gamePieceDimension / 2) *
          fieldSizeMultiplier,
        (pieces[i].collectionLocation.x - gamePieceDimension / 2) *
          fieldSizeMultiplier,
        gamePieceDimension * fieldSizeMultiplier,
        gamePieceDimension * fieldSizeMultiplier
      );
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(
        pieces[i].result,
        pieces[i].collectionLocation.y * fieldSizeMultiplier,
        pieces[i].collectionLocation.x * fieldSizeMultiplier
      );
    };
  }
}

// Function to get data from the json file, and
function getDataAndDrawAutoPaths() {
  for (let i = 0; i < parsedJSONOutput.length; i++) {
    drawAutoPath(
      parsedJSONOutput[i]["03auto"],
      "Match " + parsedJSONOutput[i]["01metaData"].matchNumber
    );
  }
}

// Function to retrieve value by JSON path
function getValues(JSON, path) {
  return jsonpath.query(JSON, path).length;
}

window.updateTeamNumber = updateTeamNumber;
function updateTeamNumber(input) {
  // Get the current URL
  var url = new URL(window.location.href);

  // Set or update URL parameters
  url.searchParams.set("team", input.value);

  // Replace the current URL with the modified one
  window.location.href = url.toString();
}

let teamNumberInput = document.getElementById("teamNumberInput");
teamNumberInput.value = teamNumber;
teamNumberInput.focus();
// drawAutoPath([
//   {
//     collectionLocation: {
//       name: "blue3",
//       x: 2.9,
//       y: 4.1,
//     },
//     name: "Note",
//     color: "rgb(0, 0, 186.66666666666666)",
//     result: "Amp",
//   },
//   {
//     collectionLocation: {
//       name: "blue3",
//       x: 10,
//       y: 4.1,
//     },
//     name: "Note",
//     color: "rgb(0, 0, 186.66666666666666)",
//     result: "Amp",
//   },
//   {
//     collectionLocation: {
//       name: "blue3",
//       x: 10,
//       y: 7,
//     },
//     name: "Note",
//     color: "rgb(0, 0, 186.66666666666666)",
//     result: "Amp",
//   },
// ]);
getDataAndDrawAutoPaths();
