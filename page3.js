
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

// Get the data
d3.csv("perc_demog_20200726_clean.csv").get(function(data) {

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
    .property("selected", function(d){ return d === 'United States'; })


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
      .call(
        d3.axisLeft(y)
        .tickFormat(d3.format(".0%"))
      );


  // X axis
  x.domain(data.map(function(d) { return d.group; }))
  xAxis.transition().duration(1000).call(d3.axisBottom(x))

  // Add Y axis
  y.domain([0, 1]);
  yAxis.transition().duration(1000).call(d3.axisLeft(y).tickFormat(d3.format(".0%")));

  var xSubgroup = d3.scaleBand()
      .domain(subgroups)
      .range([0, x.bandwidth()])
      .padding([0.05])

  var color = d3.scaleOrdinal()
      .domain(subgroups)
      .range(['#038387','#40587C','#A4262C']) //green: #038387, blue: #40587C, red: #A4262C

  svg.append("text")
    .attr("x", (width / 2))
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text("Percent of Covid Cases/Deaths by Racial Group");

  svg.append("circle").attr("cx",width/3+80).attr("cy",10).attr("r", 6).style("fill", "#A4262C")
  svg.append("circle").attr("cx",width/3+200).attr("cy",10).attr("r", 6).style("fill", "#038387")
  svg.append("circle").attr("cx",width/3-50).attr("cy",10).attr("r", 6).style("fill", "#40587C")
  svg.append("text").attr("x", width/3+110).attr("y", 10).text("Deaths").style("font-size", "15px").attr("alignment-baseline","middle")
  svg.append("text").attr("x", width/3+230).attr("y", 10).text("Population").style("font-size", "15px").attr("alignment-baseline","middle")
  svg.append("text").attr("x", width/3-20).attr("y", 10).text("Cases").style("font-size", "15px").attr("alignment-baseline","middle")

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

  function update(selectedVar){
      d3.selectAll(".bar").remove();
      filtered_data = data.filter(function(d){return d.state==selectedVar})

      // Three function that change the tooltip when user hover / move / leave a cell
      var mouseover = function(d) {
        tooltip
            .html("Percent of Cases: "+d3.format(".2%")(d.cases)+"<br> Percent of Deaths: "+d3.format(".2%")(d.deaths)+"<br>Percent of Population: "+d3.format(".2%")(d.population))
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

      svg.append("g")
        .selectAll("g")
        // Enter in data = loop group per group
        .data(filtered_data)
        .enter()
        .append("g")
          .attr("transform", function(d) { return "translate(" + x(d.group) + ",0)"; })
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
        .selectAll("rect")
        .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
        .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return xSubgroup(d.key); })
          .attr("y", function(d) {console.log((d.value)); console.log(y(d.value)); return y(d.value); })
          .attr("width", xSubgroup.bandwidth())
          .attr("height", function(d) { return height - y(d.value); })
          .attr("fill", function(d) { return color(d.key); });
  }
  update('United States')
  d3.select("#selectButton").on("change", function(d) {
    var selectedOption = d3.select(this).property("value")
    update(selectedOption)
  });
  svg.append("line")
    .attr("x1", width/5-10)
    .attr("x2", width/5-10)
    .attr("y1", height/1.5 - 5)
    .attr("y2", 50)
    .style("stroke", "gray")
  svg.append("text")
    .attr("x", width/5-10)
    .attr("y", 40)
    .text("Black Americans have the largest \n   discrepancy between % population and % deaths")
    .style("font-size", "12px")
    .attr("alignment-baseline","middle")
});
