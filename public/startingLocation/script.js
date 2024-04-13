import {
  getJSONConfig,
  xPositionMetersToPixelsFromTop,
  yPositionMetersToPixelsFromLeft,
} from "/util.js";

let JSONConfig = await getJSONConfig();
let fieldContainer = document.getElementById("fieldContainer");
let fieldImage = document.getElementById("fieldImage");
generateStartingLocationButtons();

// Dynamically generating buttons to select starting location
function generateStartingLocationButtons() {
  let startingLocations = JSONConfig.startingLocations;

  for (let i = 0; i < startingLocations.length; i++) {
    let button = document.createElement("button");
    button.onclick = function () {
      selectPosition(startingLocations[i]);
    };

    button.classList.add("positionButton");

    button.style.top =
      xPositionMetersToPixelsFromTop(fieldImage, startingLocations[i].x, 5) +
      "px";
    button.style.left =
      yPositionMetersToPixelsFromLeft(fieldImage, startingLocations[i].y, 5) +
      "px";
    fieldContainer.appendChild(button);
    button.style.position = "absolute";
  }
}

function selectPosition(position) {
  localStorage.setItem("startingLocation", position);
}
