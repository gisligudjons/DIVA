// set the dimensions and margins of the graph
var margin = {top: 5, right: 30, bottom: 30, left: 60},
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


var mindate = new Date(2008,0,1),
    maxdate = new Date(2020,0,31);

//Read the data
d3.csv("https://raw.githubusercontent.com/gisligudjons/DIVA/main/data.csv",

  // When reading the csv, I must format variables:
  function(d){
    return { Start_Date : d3.timeParse("%m/%d/%Y")(d.Start_Date), value : d.DataValue, Name : d.Name, Borough : d.GeoPlaceName }
  },

  // Now I can use this dataset:
  function(data) {

    // Add X axis --> it is a date format
    var x = d3.scaleTime()
      .domain([mindate, maxdate])
      .range([ 0, width ]);
    svg.append("g")
        .attr("class", "myXaxis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .attr("opacity", "1")
        

    // Add Y axis
    var y = d3.scaleLinear()
      .domain( [0, 40])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));

    var color = d3.scaleOrdinal()
      .domain(["Nitrogen Dioxide (NO2)", "Sulfur Dioxide (SO2)", "Ozone (O3)"])
      .range(["#440154ff", "#21908dff", "#fde725ff"])

  // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
  // Its opacity is set to 0: we don't see it by default.
    var tooltip = d3.select("#my_dataviz")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)


    var tipMouseover = function(d) {
        

        tooltip
        .html(d.Name + " in the " + d.Borough + " Borough" + "<br/>" + d.Start_Date + "<br/>" + d.value + " Ppb (mean)")
        .style("left", (d3.event.pageX + 15) + "px")
        .style("top", (d3.event.pageY - 28) + "px")
        .transition()
        .duration(200) // ms
        .style("opacity", .9) // started as 0!
        };

        // tooltip mouseout event handler
    var tipMouseout = function(d) {
            tooltip.transition()
                .duration(300) // ms
                .style("opacity", 0); // don't care about position!
            };
    
    
    // Add the points
    svg.append('g')
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
        .attr("cx", function(d) { return x(d.Start_Date) } )
        .attr("cy", function(d) { return y(d.value) } )
        .attr("r", 3)
        .style("fill", function(d) { return color((d.Name));}) 
        .on("mouseover", tipMouseover)
        .on("mouseleave", tipMouseout)
    // Add X axis label:
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height + margin.top - 15)
        .text("Year")
        .style("z-indeex", 100);

    // Y axis label:
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left+20)
        .attr("x", -margin.top)
        .text("Ppb (mean)")

                // draw legend
    var legend = svg.selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        // draw legend colored rectangles
    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

        // draw legend text
    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d;})


})


//Links

//For the scatterplot
// https://www.d3-graph-gallery.com/graph/scatter_basic.html

// For the color of the third variable
//https://www.d3-graph-gallery.com/graph/custom_color.html
//https://github.com/d3/d3-scale-chromatic

//For the legend
// https://www.d3-graph-gallery.com/graph/custom_axis.html

//For the tooltip:
//http://bl.ocks.org/williaster/af5b855651ffe29bdca1