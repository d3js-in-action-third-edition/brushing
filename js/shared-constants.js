// Chart
const margin = {top: 40, right: 20, bottom: 25, left: 50};
const width = 1200;
const height = 500;
const brushHeight = 120;
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;
const brushInnerHeight = brushHeight - margin.top - margin.bottom;
let innerChart;
let innerChartBrush;

// Tooltip
const tooltipWidth = 65;
const tooltipHeight = 32;