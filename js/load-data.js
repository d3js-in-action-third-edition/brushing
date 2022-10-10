d3.csv("./data/political-regimes.csv", d3.autoType).then(data => {
  console.log("democracy data", data);

  drawCharts(data);
});