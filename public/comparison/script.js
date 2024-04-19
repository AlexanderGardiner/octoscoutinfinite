import {
  getGraphJSONConfig,
  getJSONOutput,
  quartiles,
  calculateMean,
} from "/util.js";
let graphConfig = await getGraphJSONConfig();
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

// Function to draw a graph to the screen
function drawGraph(graphConfigs, chartName, graphContainer) {
  let chartDiv = document.createElement("div");
  chartDiv.id = chartName;
  chartDiv.classList.add("chart");
  graphContainer.appendChild(chartDiv);
  // Defining the parameters for the graph
  let chartParameters = {
    title: {
      text: chartName,
    },
    dataPointMaxWidth: 20,
    data: graphConfigs,
    axisX: {
      interval: 1,
      labelAutoFit: false,
    },
  };
  // Drawing graph
  var chart = new CanvasJS.Chart(chartName, chartParameters);
  chart.render();
}

function drawGraphs() {
  // Defining which graphs to create based on which configs

  // Creating graphs under the overall category
  let comparisonGraphs = graphConfig.Comparison;
  getDataAndCreateGraph(
    comparisonGraphs,
    document.getElementById("graphContainer"),
    "Comparison"
  );
}

// Function to get data from the json file, and
function getDataAndCreateGraph(
  graphCategory,
  graphContainer,
  graphCategoryName
) {
  let blueTeams = ["9084", "1", "2"];
  let redTeams = ["1", "2"];

  let graphConfigs = getGraphConfigForTeams(
    blueTeams,
    graphCategory,
    graphCategoryName,
    true
  );
  graphCategory.reverse();
  graphConfigs.push.apply(
    graphConfigs,
    getGraphConfigForTeams(redTeams, graphCategory, graphCategoryName, false)
  );

  // Drawing graph
  drawGraph(graphConfigs, graphCategoryName, graphContainer);
}

function getGraphConfigForTeams(
  teams,
  graphCategory,
  graphCategoryName,
  teamIsBlue
) {
  let graphConfigs = [];
  let maxColorIteratorValue = 255;
  let iteratorColorStartingValue = 100;
  let colorIterator = iteratorColorStartingValue;

  // Looping through each team
  for (let l = 0; l < teams.length; l++) {
    let dataPoints = [];
    // Creating a graph for each section under the category
    for (let k = 0; k < graphCategory.length; k++) {
      let values = [];
      // Getting matches of the team
      let matchesOfTeam = parsedJSONOutput.filter((obj) => {
        const metaData = obj["01metaData"];
        return metaData.teamNumber === teams[l];
      });

      // Computing the values for the metric for each match
      for (let i = 0; i < matchesOfTeam.length; i++) {
        let totalForMatch = 0;
        for (let j = 0; j < graphCategory[k].metrics.length; j++) {
          totalForMatch +=
            getValues(matchesOfTeam[i], graphCategory[k].metrics[j].path) *
            graphCategory[k].metrics[j].weight;
        }
        values.push(totalForMatch);
      }

      // Calculating quartiles and mean
      let quartilesValues = quartiles(values);
      dataPoints.push({
        label: graphConfig[graphCategoryName][k].graphName,
        y: quartilesValues.Q3,
      });
    }
    let color;
    if (teamIsBlue) {
      colorIterator +=
        (maxColorIteratorValue - iteratorColorStartingValue) / teams.length;
      color =
        "rgb(" +
        [
          0,
          (colorIterator - iteratorColorStartingValue) / 2,
          colorIterator,
        ].join(",") +
        ")";
    } else {
      colorIterator +=
        (maxColorIteratorValue - iteratorColorStartingValue) / teams.length;
      color =
        "rgb(" +
        [
          colorIterator,
          (colorIterator - iteratorColorStartingValue) / 2,
          0,
        ].join(",") +
        ")";
    }
    console.log(dataPoints);
    graphConfigs.push({
      type: "stackedBar100",
      color: color,
      dataPoints: dataPoints,
    });
    console.log(graphConfigs);
  }
  return graphConfigs;
}

// Function to retrieve value by JSON path
function getValues(JSON, path) {
  return jsonpath.query(JSON, path).length;
}

drawGraphs();
