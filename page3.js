
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




  // Get the data
const data = await d3.csv("perc_demog_20200726_clean.csv")

    var all_states = d3.map(data, function(d){return(d.state)}).keys()
    var subgroups = data.columns.slice(1)
    var groups = d3.map(data, function(d){return(d.group)}).keys()

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
        .padding(0.2)
        .domain(groups);

    var xAxis = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSize(0));


    var y = d3.scaleLinear()
        .range([height, 0])
        .domain([0,1]);

    var yAxis = svg.append("g")
        .call(d3.axisLeft(y));


    // X axis
    x.domain(data.map(function(d) { return d.group; }))
    xAxis.transition().duration(1000).call(d3.axisBottom(x))

    // Add Y axis
    y.domain([0, 1]);
    yAxis.transition().duration(1000).call(d3.axisLeft(y));

    var xSubgroup = d3.scaleBand()
        .domain(subgroups)
        .range([0, x.bandwidth()])
        .padding([0.05])

    var color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(['#e41a1c','#377eb8','#4daf4a'])

function update(selectedVar){
    data = data.filter(function(d){return d.state==selectedVar})

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
        .attr("fill", function(d) { return color(d.key); });

}

update('United States')

d3.select("#selectButton").on("change", function(d) {
  // recover the option that has been chosen
  var selectedOption = d3.select(this).property("value")
  // run the updateChart function with this selected option
  selected1 = selectedOption
  update(selectedOption)
})
