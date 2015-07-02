//set up width, height, margin
var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 40
    },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
// set up scale and axis
var xScale = d3.scale.linear().range([0, width]);
var yScale = d3.scale.linear().range([height, 0]);
var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
var yAxis = d3.svg.axis().scale(yScale).orient("left");
//set up x
var xValue;
var xMap;
//set up y
var yValue;
var yMap;
// setup fill color
var cValue = function(d) {
        return d['Manufacturer'];
    },
    color = d3.scale.category10();
// add the graph canvas to the body of the webpage
var svg = d3.select(".plot-box").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
// add the tooltip area to the webpage
var tooltip = d3.select(".plot-box").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
var headers = [];
var axisListHTML = '';
var xAxisSelector = document.querySelector('#x-axis-selector');
var yAxisSelector = document.querySelector('#y-axis-selector');
var xAxisLabelSelector;
var yAxisLabelSelector;
var xIndex = 0;
var yIndex = 1;
var xAxisObj;
var yAxisObj;
var dotsObj;
// load data
d3.csv("data/cereal.csv", function(error, rows) {
    // change string (from CSV) into number format
    rows.forEach(function(d) {
        Object.keys(d).forEach(function(key) {
            if (!isNaN(d[key])) {
                d[key] = +d[key];
            }
        })
    });
    data = rows
    //add numeric headers only
    Object.keys(data[0]).forEach(function(key) {
        if (!isNaN(data[0][key])) {
            headers.push(key);
        }
    });
    //add options
    headers.forEach(function(header) {
        axisListHTML += '<option value=' + header + '>' + header + '</option>';
    });
    xAxisSelector.innerHTML = axisListHTML;
    yAxisSelector.innerHTML = axisListHTML;
    xAxisSelector.value = headers[xIndex];
    yAxisSelector.value = headers[yIndex];
    xAxisSelector.style.display = 'block';
    yAxisSelector.style.display = 'block';
    xAxisSelector.onchange = function() {
        xIndex = this.options.selectedIndex;
        render();
    }
    yAxisSelector.onchange = function() {
        yIndex = this.options.selectedIndex;
        render();
    }
    // set up x axis object
    xAxisObj = svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")");

    //add x label
    xAxisObj.append("text")
      .attr("class", "x-axis-label label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end");

    xAxisLabelSelector = d3.select('.x-axis-label')


    //set up y axis object
    yAxisObj = svg.append("g")
        .attr("class", "y axis")

    //add y label
    yAxisObj.append("text")
      .attr("class", "y-axis-label label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end");

    yAxisLabelSelector = d3.select('.y-axis-label')

    //set up dots object
    dotsObj = svg.selectAll(".dot")
        .data(data)
        .enter().append("circle");

    dotsObj.attr("class", "dot")
        .attr("r", 4.5)
        .style("fill", function(d) {
          console.log('d',cValue(d));
            return color(cValue(d));
        })
        .style("opacity", function(d) {
            return 0.4;
        })

    render();

    //add legend later
    //addLegend();
});

function render() {

    xValue = function(d) {
        return d[headers[xIndex]]
    };
    xMap = function(d) {
        return xScale(xValue(d))
    };
    yValue = function(d) {
        return d[headers[yIndex]]
    };
    yMap = function(d) {
        return yScale(yValue(d))
    };

    var xRange = d3.max(data, xValue) - d3.min(data, xValue);
    var yRange = d3.max(data, yValue) - d3.min(data, yValue);

    xScale.domain([d3.min(data, xValue) - xRange/10, d3.max(data, xValue) + xRange/10]);
    yScale.domain([d3.min(data, yValue) - yRange/10, d3.max(data, yValue) + yRange/10]);

    // x-axis
    xAxisObj
        .call(xAxis)

    xAxisLabelSelector.text(headers[xIndex]);

    // y-axis
    yAxisObj
        .call(yAxis)

    yAxisLabelSelector.text(headers[yIndex]);

    // draw dots
    dotsObj
        .transition()
        .duration( Math.floor(Math.random() * 20) + 80)
        .attr("cx", xMap)
        .attr("cy", yMap)
}

function addLegend() {
    // draw legend
    var legend = svg.selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) {
            return "translate(0," + i * 20 + ")";
        });
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
        .text(function(d) {
            return d;
        })
}
