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

function drawGraph(dataPoints, meanPoints, chartName, yLabel, graphContainer) {
  let chartDiv = document.createElement("div");
  chartDiv.id = chartName;
  chartDiv.classList.add("chart");
  graphContainer.appendChild(chartDiv);
  let ranks = "";
  for (let i = 0; i < dataPoints.length; i++) {
    if (i != 0) {
      ranks = ranks + "," + dataPoints[i].label;
    } else {
      ranks = dataPoints[i].label;
    }
  }
  let scores = "";
  for (let i = 0; i < dataPoints.length; i++) {
    if (i != 0) {
      scores = scores + "," + dataPoints[i].y[2];
    } else {
      scores = dataPoints[i].y[2];
    }
  }
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
  console.log(chartParameters);
  var chart = new CanvasJS.Chart(chartName, chartParameters);
  chart.render();
}

let overallGraphs = graphConfig.Overall;
getDataAndCreateGraph(
  overallGraphs,
  document.getElementById("overallGraphContainer"),
  "Overall"
);

let teleopGraphs = graphConfig.Teleop;
getDataAndCreateGraph(
  teleopGraphs,
  document.getElementById("teleopGraphContainer"),
  "Teleop"
);
let autoGraphs = graphConfig.Auto;
getDataAndCreateGraph(
  autoGraphs,
  document.getElementById("autoGraphContainer"),
  "Auto"
);

let endgameGraphs = graphConfig.Endgame;
getDataAndCreateGraph(
  endgameGraphs,
  document.getElementById("endgameGraphContainer"),
  "Endgame"
);

function getDataAndCreateGraph(
  graphCategory,
  graphContainer,
  graphCategoryName
) {
  let matchesOfTeam = parsedJSONOutput.filter((obj) => {
    const metaData = obj["01metaData"];
    return metaData.teamNumber === "1";
  });
  for (let k = 0; k < graphCategory.length; k++) {
    let dataPoints = [];
    let means = [];
    let values = Array().fill(0);
    for (let i = 0; i < matchesOfTeam.length; i++) {
      let totalForMatch = 0;
      for (let j = 0; j < graphCategory[k].metrics.length; j++) {
        console.log(matchesOfTeam[i]);
        console.log(
          graphCategory[k].metrics[j].path +
            getValues(matchesOfTeam[i], graphCategory[k].metrics[j].path)
        );
        totalForMatch +=
          getValues(matchesOfTeam[i], graphCategory[k].metrics[j].path) *
          graphCategory[k].metrics[j].weight;
      }
      console.log(totalForMatch);
      values.push(totalForMatch);
    }

    let quartilesValues = quartiles(values);
    let mean = calculateMean(values);
    means.push({ label: "test", y: mean });
    dataPoints.push({
      label: "test",
      y: [
        Math.min(...values),
        quartilesValues.Q1,
        quartilesValues.Q3,
        Math.max(...values),
        quartilesValues.Q2,
      ],
    });
    drawGraph(
      dataPoints,
      means,
      graphCategoryName + " " + graphConfig.Teleop[k].graphName,
      "test",
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
