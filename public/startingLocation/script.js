import { getJSONConfig } from "/util.js";

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
      fieldImage.getBoundingClientRect().top +
      startingLocations[i].x * (fieldImage.clientHeight / 16.4) -
      (0.05 * window.innerHeight) / 2 +
      "px";
    button.style.left =
      fieldImage.getBoundingClientRect().left +
      startingLocations[i].y * (fieldImage.clientWidth / 8.2) -
      (0.05 * window.innerHeight) / 2 +
      "px";
    fieldContainer.appendChild(button);
    button.style.position = "absolute";
  }
}

function selectPosition(position) {
  localStorage.setItem("startingLocation", position);
}
