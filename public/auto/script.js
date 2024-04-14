import {
  getJSONConfig,
  xPositionMetersToPixelsFromTop,
  yPositionMetersToPixelsFromLeft,
} from "/util.js";

let JSONConfig = await getJSONConfig();
let fieldContainer = document.getElementById("fieldContainer");
let fieldImage = document.getElementById("fieldImage");
let gamePieceViewer = document.getElementById("gamePieceContainer");
let gamePieces = [];
generateStartingLocationButtons();

class GamePiece {
  constructor(collectionLocation, name, color) {
    this.collectionLocation = collectionLocation;
    this.name = name;
    this.color = color;
  }
}

// Dynamically generating buttons to select auto collections
function generateStartingLocationButtons() {
  let gamePieces = JSONConfig.gamePieces;

  for (let i = 0; i < gamePieces.length; i++) {
    let blueButtonColorIterator = 75;
    for (let j = 0; j < gamePieces[i].blueAutoCollectionLocations.length; j++) {
      addCollectionButton(
        gamePieces[i].blueAutoCollectionLocations[j],
        gamePieces[i].name,
        "rgb(" + [0, 0, blueButtonColorIterator].join(",") + ")"
      );
      blueButtonColorIterator +=
        180 / gamePieces[i].blueAutoCollectionLocations.length;
    }
    let redButtonColorIterator = 75;
    for (let j = 0; j < gamePieces[i].redAutoCollectionLocations.length; j++) {
      addCollectionButton(
        gamePieces[i].redAutoCollectionLocations[j],
        gamePieces[i].name,
        "rgb(" + [redButtonColorIterator, 0, 0].join(",") + ")"
      );
      redButtonColorIterator +=
        180 / gamePieces[i].redAutoCollectionLocations.length;
    }
    let neutralButtonColorIterator = 75;
    for (
      let j = 0;
      j < gamePieces[i].neutralAutoCollectionLocations.length;
      j++
    ) {
      addCollectionButton(
        gamePieces[i].neutralAutoCollectionLocations[j],
        gamePieces[i].name,
        "rgb(" + [0, neutralButtonColorIterator, 0].join(",") + ")"
      );
      neutralButtonColorIterator +=
        180 / gamePieces[i].neutralAutoCollectionLocations.length;
    }
  }
}

function addCollectionButton(collectionLocation, gamePieceName, buttonColor) {
  let button = document.createElement("img");
  button.onclick = function () {
    collectPiece(collectionLocation, gamePieceName, buttonColor);
  };

  button.classList.add("positionButton");

  button.style.top =
    xPositionMetersToPixelsFromTop(fieldImage, collectionLocation.x, 5) + "px";
  button.style.left =
    yPositionMetersToPixelsFromLeft(fieldImage, collectionLocation.y, 5) + "px";
  fieldContainer.appendChild(button);
  button.style.position = "absolute";
  button.src = "/images/" + gamePieceName + ".png";
  button.style.backgroundColor = buttonColor;
}

function collectPiece(location, gamePieceName, buttonColor) {
  gamePieces.push(new GamePiece(location, gamePieceName, buttonColor));
  updateGamePieceViewer();
}

function updateGamePieceViewer() {
  gamePieceViewer.innerHTML = "";
  for (let i = 0; i < gamePieces.length; i++) {
    let possibleResults = [];
    for (let j = 0; j < JSONConfig.gamePieces.length; j++) {
      if (JSONConfig.gamePieces[j].name == gamePieces[i].name) {
        possibleResults = JSONConfig.gamePieces[j].autoPossibleResults;
      }
    }
    let gamePieceContainer = document.createElement("div");
    gamePieceContainer.style.alignItems = "center";
    gamePieceContainer.style.display = "flex";
    let gamePieceImage = document.createElement("img");
    gamePieceImage.src = "/images/" + gamePieces[i].name + ".png";
    gamePieceImage.style.width = "5vh";
    gamePieceImage.style.height = "5vh";
    gamePieceImage.style.margin = "5px";
    gamePieceImage.style.top = "0px";

    let gamePieceResultSelector = document.createElement("select");
    gamePieceResultSelector.style.margin = "5px";
    gamePieceResultSelector.style.top = "0px";
    for (var j = 0; j < possibleResults.length; j++) {
      var option = document.createElement("option");
      option.value = possibleResults[j].name;
      option.text = possibleResults[j].name;
      gamePieceResultSelector.appendChild(option);
    }
    gamePieceContainer.appendChild(gamePieceImage);
    gamePieceContainer.appendChild(gamePieceResultSelector);
    gamePieceViewer.appendChild(gamePieceContainer);
    gamePieceContainer.style.backgroundColor = gamePieces[i].color;

    document.getElementById("gamePieceViewer").scrollTop =
      document.getElementById("gamePieceViewer").scrollHeight;
  }
}
