let scoutNameInput = document.getElementById("scoutNameInput");
let teamNumberInput = document.getElementById("teamNumberInput");
let matchNumberInput = document.getElementById("matchNumberInput");
let teamColorInput = document.getElementById("teamColorInput");

function loadStoredData() {
  let data = localStorage.getItem("metaData");
  if (data != null) {
    let metaData = JSON.parse(data);
    scoutNameInput.value = metaData.scoutName;
    matchNumberInput.value = parseInt(metaData.matchNumber) + 1;
    teamColorInput.value = metaData.teamColor;
  }
}

function saveData() {
  let metaData = {};
  metaData.scoutName = scoutNameInput.value;
  metaData.teamNumber = teamNumberInput.value;
  metaData.matchNumber = matchNumberInput.value;
  metaData.teamColor = teamColorInput.value;
  localStorage.setItem("metaData", JSON.stringify(metaData));
}

loadStoredData();
localStorage.clear();
