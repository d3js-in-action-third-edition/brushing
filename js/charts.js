const drawCharts = (data) => {


  /*******************************/
  /*    Append the containers    */
  /*******************************/
  // Append the SVG container
  const svg = d3.select("#main-chart")
    .append("svg")
      .attr("viewBox", `0, 0, ${width}, ${height}`);
  const svgBrush = d3.select("#brush-chart")
    .append("svg")
      .attr("viewBox", `0, 0, ${width}, ${brushHeight}`);

  // Append defs for clip path 
  let clip = svg
    .append("defs")
    .append("svg:clipPath")
      .attr("id", "clip")
    .append("svg:rect")
      .attr("width", innerWidth)
      .attr("height", innerHeight)
      .attr("x", 0)
      .attr("y", 0);

  // Append the group that will contain the inner chart
  innerChart = svg
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
  innerChartBrush = svgBrush
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  
  /****************************/
  /*    Declare the scales    */
  /****************************/
  // X scale
  const firstYear = d3.min(data, d => d.year);
  const lastYear = d3.max(data, d => d.year);
  const xScale = d3.scaleLinear()
    .domain([firstYear, lastYear])
    .range([0, innerWidth]);
  const xScaleBrush = d3.scaleLinear()
    .domain([firstYear, lastYear])
    .range([0, innerWidth]);

  // Y scale
  const maxPeople = d3.max(data, d => d.liberal_democracies);
  const yScale = d3.scaleLinear()
    .domain([0, maxPeople])
    .range([innerHeight, 0])
    .nice();
  const yScaleBrush = d3.scaleLinear()
    .domain([0, maxPeople])
    .range([brushInnerHeight, 0]);

  
  /***************************/
  /*     Append the axes     */
  /***************************/
  // Bottom axis
  const bottomAxisGenerator = d3.axisBottom(xScale)
    .tickFormat(d3.format(""))
    .tickSizeOuter(0);
  const bottomAxisBrush = d3.axisBottom(xScaleBrush)
    .tickFormat(d3.format(""))
    .tickSizeOuter(0);
  const bottomAxis = innerChart
    .append("g")
      .attr("class", "axis-x")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(bottomAxisGenerator);
  innerChartBrush
    .append("g")
      .attr("class", "axis-x")
      .attr("transform", `translate(0, ${brushInnerHeight})`)
      .call(bottomAxisBrush);

  // Left axis
  const leftAxisGenerator = d3.axisLeft(yScale)
    .tickFormat(d3.format("~s"))
    .tickSizeOuter(0);
  const leftAxis = innerChart
    .append("g")
      .attr("class", "axis-y")
      .call(leftAxisGenerator);

  
  /***********************/
  /*     Area charts     */
  /***********************/
  let areaGenerator = d3.area()
    .x(d => xScale(d.year))
    .y0(yScale(0))
    .y1(d => yScale(d.liberal_democracies))
    .curve(d3.curveCatmullRom);
  const areaGeneratorBrush = d3.area()
    .x(d => xScaleBrush(d.year))
    .y0(yScaleBrush(0))
    .y1(d => yScaleBrush(d.liberal_democracies))
    .curve(d3.curveCatmullRom);

  // Draw the area
  const chart = innerChart
    .append("g")
      .attr("clip-path", "url(#clip)") // Hide parts of the graph that are outiside of the inner chart
    .append("path")
      .attr("d", areaGenerator(data))
      .attr("fill", "#DE6B48");
  innerChartBrush
    .append("path")
      .attr("d", areaGeneratorBrush(data))
      .attr("fill", "#DE6B48");


  /*******************************/
  /*     Add brush-able area     */
  /*******************************/
  const handleBrush = (e) => {
    console.log(e);
    if (e) {
      // Update upper chart
      const lowerBoundary = Math.round(xScaleBrush.invert(e.selection[0]));
      const upperBoundary = Math.round(xScaleBrush.invert(e.selection[1]));
      const indexLowerBoundary = data.findIndex(d => d.year === lowerBoundary);
      const indexUpperBoundary = data.findIndex(d => d.year === upperBoundary);
      const selectedData = data.slice(indexLowerBoundary, indexUpperBoundary + 1);
      const yMax = d3.max(selectedData, d => d.liberal_democracies);

      xScale
        .domain([lowerBoundary, upperBoundary]);

      yScale
        .domain([0, yMax]);

      const t = d3.transition()
        .duration(1000);

      bottomAxis
        .transition(t)
          .call(bottomAxisGenerator);

      leftAxis
        .transition(t)
          .call(leftAxisGenerator);

      chart
        .transition(t)
          .attr("d", areaGenerator(data));

    }
  };

  console.log(xScale(1900))
  const brush = d3.brushX() // Always capture the full height with the brush
    .extent([[0, 0], [innerWidth, brushInnerHeight]]) // Initialize the brush area
    .on("brush", handleBrush)
  innerChartBrush
    .call(brush)
    .call(brush.move, [xScale(1940), xScale(1980)]); // Initial brushed zone

  // Note that can also pan and resize area!

};