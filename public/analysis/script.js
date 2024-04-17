import { getGraphJSONConfig, getJSONOutput } from "/util.js";
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

// Function to draw a graph to the screen
function drawGraph(dataPoints, meanPoints, chartName, yLabel, graphContainer) {
  let chartDiv = document.createElement("div");
  chartDiv.id = chartName;
  chartDiv.classList.add("chart");
  graphContainer.appendChild(chartDiv);

  // Converting to the format used by the graphing library
  let ranks = "";
  for (let i = 0; i < dataPoints.length; i++) {
    if (i != 0) {
      ranks = ranks + "," + dataPoints[i].label;
    } else {
      ranks = dataPoints[i].label;
    }
  }

  // Converting to the format used by the graphing library
  let scores = "";
  for (let i = 0; i < dataPoints.length; i++) {
    if (i != 0) {
      scores = scores + "," + dataPoints[i].y[2];
    } else {
      scores = dataPoints[i].y[2];
    }
  }

  // Defining the parameters for the graph
  let chartParameters = {
    title: {
      text: chartName,
    },
    axisY: {
      title: yLabel,
    },
    dataPointMaxWidth: 5,
    data: [
      {
        type: "boxAndWhisker",
        upperBoxColor: "#7BCE69",
        lowerBoxColor: "#FF5A4D",
        color: "black",
        yValueFormatString: "##.## " + yLabel,
        dataPoints: dataPoints,
      },
      {
        type: "scatter",
        markerColor: "black",
        markerSize: 5,
        toolTipContent: "Mean: {y}",
        dataPoints: meanPoints,
      },
    ],
    axisX: {
      interval: 1,
      labelAutoFit: false,
    },
  };

  // Drawing graph
  var chart = new CanvasJS.Chart(chartName, chartParameters);
  chart.render();
}

// Defining which graphs to create based on which configs

// Creating graphs under the overall category
let overallGraphs = graphConfig.Overall;
getDataAndCreateGraph(
  overallGraphs,
  document.getElementById("overallGraphContainer"),
  "Overall"
);

// Creating graphs under the teleop category
let teleopGraphs = graphConfig.Teleop;
getDataAndCreateGraph(
  teleopGraphs,
  document.getElementById("teleopGraphContainer"),
  "Teleop"
);

// Creating graphs under the auto category
let autoGraphs = graphConfig.Auto;
getDataAndCreateGraph(
  autoGraphs,
  document.getElementById("autoGraphContainer"),
  "Auto"
);

// Creating graphs under the endgame category
let endgameGraphs = graphConfig.Endgame;
getDataAndCreateGraph(
  endgameGraphs,
  document.getElementById("endgameGraphContainer"),
  "Endgame"
);

// Function to get data from the json file, and
function getDataAndCreateGraph(
  graphCategory,
  graphContainer,
  graphCategoryName
) {
  // Getting all teams in matches scouted
  let teams = [];
  parsedJSONOutput.filter((obj) => {
    const metaData = obj["01metaData"];
    if (!teams.includes(metaData.teamNumber)) {
      teams.push(metaData.teamNumber);
    }
  });

  // Creating a graph for each section under the category
  for (let k = 0; k < graphCategory.length; k++) {
    let dataPoints = [];
    let means = [];
    let values = Array().fill(0);

    // Looping through each team
    for (let l = 0; l < teams.length; l++) {
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
      let mean = calculateMean(values);
      means.push({ label: teams[l], y: mean });
      console.log(dataPoints);

      dataPoints.push({
        label: teams[l],
        y: [
          Math.min(...values),
          quartilesValues.Q1,
          quartilesValues.Q3,
          Math.max(...values),
          quartilesValues.Q2,
        ],
      });
    }

    // Drawing graph
    drawGraph(
      dataPoints,
      means,
      graphCategoryName + " " + graphConfig.Teleop[k].graphName,
      graphCategory[k].units,
      graphContainer
    );
  }
}

// Function to retrieve value by JSON path
function getValues(JSON, path) {
  return jsonpath.query(JSON, path).length;
}

function calculateMean(values) {
  if (values.length === 0) {
    return 0; // Return 0 if the array is empty
  }

  const sum = values.reduce((acc, curr) => acc + curr, 0);
  const mean = sum / values.length;

  return mean;
}
function quartiles(values) {
  // Make a copy of the array to avoid altering the original
  var sortedValues = values.slice().sort((a, b) => a - b);

  var length = sortedValues.length;
  var half = Math.floor(length / 2);

  // Compute Q2 (median)
  var q2;
  if (length % 2 === 0) {
    // If the array has an even number of elements
    q2 = (sortedValues[half - 1] + sortedValues[half]) / 2.0;
  } else {
    // If the array has an odd number of elements
    q2 = sortedValues[half];
  }

  // Compute Q1 (lower quartile)
  var q1;
  if (half % 2 === 0) {
    // If the lower half has an even number of elements
    q1 =
      (sortedValues[Math.floor(half / 2) - 1] +
        sortedValues[Math.floor(half / 2)]) /
      2.0;
  } else {
    // If the lower half has an odd number of elements
    q1 = sortedValues[Math.floor(half / 2)];
  }

  // Compute Q3 (upper quartile)
  var q3;
  if ((length - half) % 2 === 0) {
    // If the upper half has an even number of elements
    q3 =
      (sortedValues[half + Math.floor((length - half) / 2) - 1] +
        sortedValues[half + Math.floor((length - half) / 2)]) /
      2.0;
  } else {
    // If the upper half has an odd number of elements
    q3 = sortedValues[half + Math.floor((length - half) / 2)];
  }

  return {
    Q1: q1,
    Q2: q2,
    Q3: q3,
  };
}
