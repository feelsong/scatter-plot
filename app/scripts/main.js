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
        return d.Manufacturer;
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
    //set up y axis object
    yAxisObj = svg.append("g")
        .attr("class", "y axis")
    //set up dots object
    dotsObj = svg.selectAll(".dot")
        .data(data)
        .enter().append("circle");
    dotsObj.attr("class", "dot")
        .attr("r", 3.5)
        .style("fill", function(d) {
            return color(cValue(d));
        })
        .style("opacity", function(d) {
            return 0.8;
        })
    render();
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
    xScale.domain([d3.min(data, xValue) - 1, d3.max(data, xValue) + 1]);
    yScale.domain([d3.min(data, yValue) - 1, d3.max(data, yValue) + 1]);
    // x-axis
    xAxisObj
        .call(xAxis)
        // .append("text")
        //   .attr("class", "label")
        //   .attr("x", width)
        //   .attr("y", -6)
        //   .style("text-anchor", "end")
        //   .text("Calories");
    // y-axis
    yAxisObj
        .call(yAxis)
        // .append("text")
        //   .attr("class", "label")
        //   .attr("transform", "rotate(-90)")
        //   .attr("y", 6)
        //   .attr("dy", ".71em")
        //   .style("text-anchor", "end")
        //   .text("Protein");
    // draw dots
    dotsObj
        .attr("cx", xMap)
        .attr("cy", yMap)
        // .style("fill", function(d) {
        //   return color(cValue(d));
        // })
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
