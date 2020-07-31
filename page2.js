async function graph2(){
  var margin = {top: 20, right: 20, bottom: 30, left: 70},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  // set the ranges
  var x = d3.scaleBand().range([0, width]).padding(0.4);
  var y = d3.scaleLinear().range([height, 0]);


  // append the svg obgect to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var svg = d3.select("#dataviz_area2").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .style("background-color", 'white')
      .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  // Get the data
  d3.csv("state_data_20200726.csv", function(error, data) {
    if (error) throw error;

    // format the data
    data.forEach(function(d) {
        d.state = d.State;
        d.death = +d.Deaths_Total;
    });

    // sort data
    data.sort(function(b, a) {
      return a.Value - b.Value;
    });

    // Scale the range of the data
    x.domain(data.map(function(d) { return d.state; }));
    y.domain([0, d3.max(data, function(d) {
      return Math.max(d.death); })]);


    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.state); })
        .attr("y", function(d) { return y(d.death); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.death); });

  });
}
