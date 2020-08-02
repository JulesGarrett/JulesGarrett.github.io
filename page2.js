
var margin = {top: 50, right: 20, bottom: 30, left: 70},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

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

// set the ranges
var x = d3.scaleBand().range([0, width]).padding(0.4);
var y = d3.scaleLinear().range([height, 0]);

// Add the X Axis
var xAxis = svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

// Add the Y Axis
var yAxis = svg.append("g")
    .call(d3.axisLeft(y));

svg.append("text")
  .attr("x", (width / 2))
  .attr("y", 0 - (margin.top / 2))
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .text("Covid Cases by State");


function update(selectedVar){
  // Get the data
  d3.csv("state_data_20200726.csv", function(error, data) {
    if (error) throw error;

        // sort data
    data.sort(function(b, a) {
      return a[selectedVar] - b[selectedVar];
    });

    // X axis
    x.domain(data.map(function(d) { return d.state; }))
    xAxis.transition().duration(1000).call(d3.axisBottom(x))

    // Add Y axis
    y.domain([0, d3.max(data, function(d) { return +d[selectedVar] }) ]);
    yAxis.transition().duration(1000).call(d3.axisLeft(y));

    var tooltip = d3
      .select("#tooltip")
      .append("div")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .attr("class", "tooltip");

    // variable u: map data to existing bars
    var bars = svg.selectAll("rect")
      .data(data)

    // update bars
    bars
      .enter()
      .append("rect")
      .merge(bars)
      .transition()
      .duration(1000)
        .attr("x", function(d) { return x(d.state); })
        .attr("y", function(d) { return y(d[selectedVar]); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d[selectedVar]); })
        .attr("fill", "#69b3a2")
        .on("mouseover", function () {
          return tooltip.style("visibility", "visible");
        })
        .on("mousemove", function (d) {
          let key = d.state;
          let value = d.positive;
          return tooltip
            .style("top", event.pageY - 10 + "px")
            .style("left", event.pageX + 10 + "px")
            .html("year: " + "2019" + "<br/>" + key + ":" + value + "%")
            .style("font-size", "small");
        })
        .on("mouseout", function () {
          return tooltip.style("visibility", "hidden");
        });
  })
}

// Initialize plot
update('positive')
