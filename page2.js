
var margin = {top: 50, right: 70, bottom: 30, left: 70},
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

var tooltip = d3.select("#dataviz_area")
  .append("div")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("background-color", "#dedede")
  .style("border", "solid")
  .style("border-width", "1px")
  .style("border-radius", "5px")
  .style("padding", "10px")
  .style("position", "absolute")
  .style("display", "block")

var VarOptions = ["cases", "death", "hospitalizedCurrently"]
var mycolors = d3.scaleOrdinal()
    .domain(VarOptions)
    .range(['#40587C','#A4262C','#CA5010'])

function update(selectedVar){
  // Get the data
  d3.csv("state_data_20200726.csv", function(error, data) {
    if (error) throw error;

    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function(d) {
      tooltip
          .html("State: "+d.state2+"<br>"+selectedVar+": "+d[selectedVar])
          .style("opacity", 1)
          .style("color", "black")
    }
    var mousemove = function(d) {
      tooltip
        .style("left", event.pageX +20 + "px")
        .style("top", event.pageY +20  + "px")
    }
    var mouseleave = function(d) {
      tooltip
        .style("opacity", 0)
    }

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


    // variable u: map data to existing bars
    var bars = svg.selectAll("rect")
      .data(data)

    // update bars
    bars
      .enter()
      .append("rect")
      .merge(bars)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      .transition()
      .duration(1000)
        .attr("x", function(d) { return x(d.state); })
        .attr("y", function(d) { return y(d[selectedVar]); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d[selectedVar]); })
        .attr("fill", function(d){return mycolors(selectedVar) })
  })
}

// Initialize plot
update('cases')
