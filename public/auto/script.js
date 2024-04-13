import {
  getJSONConfig,
  xPositionMetersToPixelsFromTop,
  yPositionMetersToPixelsFromLeft,
} from "/util.js";

let JSONConfig = await getJSONConfig();
let fieldContainer = document.getElementById("fieldContainer");
let fieldImage = document.getElementById("fieldImage");
let gamePieces = [];
generateStartingLocationButtons();

class GamePiece {
  constructor(collectionLocation) {
    this.collectionLocation = collectionLocation;
  }
}

// Dynamically generating buttons to select auto collections
function generateStartingLocationButtons() {
  let gamePieces = JSONConfig.gamePieces;

  for (let i = 0; i < gamePieces.length; i++) {
    for (let j = 0; j < gamePieces[i].blueAutoCollectionLocations.length; j++) {
      addCollectionButton(
        gamePieces[i].blueAutoCollectionLocations[j],
        gamePieces[i].name
      );
    }

    for (let j = 0; j < gamePieces[i].redAutoCollectionLocations.length; j++) {
      addCollectionButton(
        gamePieces[i].redAutoCollectionLocations[j],
        gamePieces[i].name
      );
    }

    for (
      let j = 0;
      j < gamePieces[i].neutralAutoCollectionLocations.length;
      j++
    ) {
      addCollectionButton(
        gamePieces[i].neutralAutoCollectionLocations[j],
        gamePieces[i].name
      );
    }
  }
}

function addCollectionButton(collectionLocation, gamePieceName) {
  let button = document.createElement("img");
  button.onclick = function () {
    collectPiece(collectionLocation);
  };

  button.classList.add("positionButton");

  button.style.top =
    xPositionMetersToPixelsFromTop(fieldImage, collectionLocation.x, 5) + "px";
  button.style.left =
    yPositionMetersToPixelsFromLeft(fieldImage, collectionLocation.y, 5) + "px";
  fieldContainer.appendChild(button);
  button.style.position = "absolute";
  button.src = "/images/" + gamePieceName + ".png";
}

function collectPiece(location) {
  gamePieces.push(new GamePiece(location));
  console.log(gamePieces);
}
