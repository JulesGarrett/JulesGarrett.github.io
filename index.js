async function graph1(){
  var margin = {top: 50, right: 70, bottom: 30, left: 70},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  // parse the date / time
  var parseTime = d3.timeParse("%Y%m%d");

  // set the ranges
  var x = d3.scaleTime().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

  // define the 1st line
  var valueline = d3.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.positive); });

  var valueline2 = d3.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.death); });


  // append the svg obgect to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var svg = d3.select("#dataviz_area").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .style("background-color", 'white')
      .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  // Get the data
  d3.csv("daily.csv", function(error, data) {
    if (error) throw error;

    // format the data
    data.forEach(function(d) {
        d.date = parseTime(d.date);
        d.positive = +d.positive;
        d.death = +d.death;
    });


    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) {
  	  return Math.max(d.positive); })]);

    // Add the valueline path.
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", valueline);

    svg.append("path")
        .data([data])
        .attr("class", "line")
        .style("stroke", "red")
        .attr("d", valueline2);

    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

    // adding title
    svg.append("text")
      .attr("x", (width / 2))
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text("Total Number of Covid Cases and Deaths in United States");

    // adding legend
    svg.append("circle").attr("cx",width/2+50).attr("cy",10).attr("r", 6).style("fill", "blue")
    svg.append("circle").attr("cx",width/2-150).attr("cy",10).attr("r", 6).style("fill", "red")
    svg.append("text").attr("x", width/2+80).attr("y", 10).text("Cases").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", width/2-120).attr("y", 10).text("Deaths").style("font-size", "15px").attr("alignment-baseline","middle")

    // Annotation: First Case
    svg.append("line")
      .attr("x1", 10)
      .attr("x2", 10)
      .attr("y1", height/3)
      .attr("y2", height-10)
      .style("stroke", "gray")
    svg.append("text")
      .attr("x", 10)
      .attr("y", height/3+5)
      .text("Jan. 21: The first reported Covid Case in the US")
      .style("font-size", "12px")
      .attr("alignment-baseline","middle")

    // Annotation: LockDown
    svg.append("line")
      .attr("x1", width/5)
      .attr("x2", width/5)
      .attr("y1", height/2)
      .attr("y2", height-10)
      .style("stroke", "gray")
    svg.append("text")
      .attr("x", width/5)
      .attr("y", height/2+5)
      .text("Mar. 13: Trump declares national emergency")
      .style("font-size", "12px")
      .attr("alignment-baseline","middle")

  // Annotation: ReOpen
  svg.append("line")
    .attr("x1", width/2)
    .attr("x2", width/2)
    .attr("y1", height-80)
    .attr("y2", height-10)
    .style("stroke", "gray")
  svg.append("text")
    .attr("x", width/2)
    .attr("y", height-75)
    .text("Early-Mid May: States start to reopen")
    .style("font-size", "12px")
    .attr("alignment-baseline","middle")

// Annotation: First Day of Summer
svg.append("line")
  .attr("x1", width-(width/5))
  .attr("x2", width-(width/5))
  .attr("y1", height/1.5)
  .attr("y2", height-10)
  .style("stroke", "gray")
svg.append("text")
  .attr("x", width-(width/5))
  .attr("y", height/1.5+5)
  .text("Jun. 20: First Day of Summer")
  .style("font-size", "12px")
  .attr("alignment-baseline","middle")
});
}
