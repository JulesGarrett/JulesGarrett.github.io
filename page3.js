
var margin = {top: 20, right: 20, bottom: 30, left: 70},
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


function update(selectedVar){
  // Get the data
  d3.csv("perc_demog_20200726_clean.csv", function(error, data) {
    if (error) throw error;

    var all_states = d3.map(data, function(d){return(d.state)}).keys()
    var subgroups = data.columns.slice(1)
    var groups = d3.map(data, function(d){return(d.group)}).keys()
    console.log(subgroups)
    console.log(groups)

    var dropdownButton = d3.select("#selectButton")
    dropdownButton
      .selectAll('myOptions')
      .data(all_states)
      .enter()
      .append('option')
      .text(function (d) { return d; })
      .attr("value", function (d) { return d; })

      // dropdownButton.on("change", function(d) {
      //   var selectedOption = d3.select(this).property("value")
      //   updateChart(selectedOption)
      // })


    var x = d3.scaleBand()
        .range([0, width])
        .padding(0.8)
        .domain(groups);

    var xAxis = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));


    var y = d3.scaleLinear()
        .range([height, 0]);

    var yAxis = svg.append("g")
        .call(d3.axisLeft(y));


    // X axis
    x.domain(data.map(function(d) { return d.group; }))
    xAxis.transition().duration(1000).call(d3.axisBottom(x))

    // Add Y axis
    y.domain([0, d3.max(data, function(d) { return +d[selectedVar] }) ]);
    yAxis.transition().duration(1000).call(d3.axisLeft(y));

    var xSubgroup = d3.scaleBand()
        .domain(subgroups)
        .range([0, x.bandwidth()])
        .padding([0.05])

    svg.append("g")
      .selectAll("g")
      // Enter in data = loop group per group
      .data(data)
      .enter()
      .append("g")
        .attr("transform", function(d) { return "translate(" + x(d.group) + ",0)"; })
      .selectAll("rect")
      .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
      .enter().append("rect")
        .attr("x", function(d) { return xSubgroup(d.key); })
        .attr("y", function(d) { return y(d.value); })
        .attr("width", xSubgroup.bandwidth())
        .attr("height", function(d) { return height - y(d.value); })
        .attr("fill", "#69b3a2");

}
)}

// Initialize plot
update('cases')
