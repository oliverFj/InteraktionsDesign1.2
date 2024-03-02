// Define the array of dream objects

/*
"name": "Dream 1",
"size": 20,
"randomness": 100,
"speed": 0.005,
"threshold": 50,
"opacity": 50,
"color": "#619EC2"
*/


var dreams = [
    { name: "Dream 1", x: 10, y: 20, color: "#BF3F61", size: 30 },
    { name: "Dream 2", x: 40, y: 60, color: "#639AA6", size: 20 },
    { name: "Dream 3", x: 80, y: 10, color: "#547346", size: 40 },
    { name: "Dream 4", x: 90, y: 80, color: "#F2B138", size: 20},
    { name: "Dream 5", x: 30, y: 40, color: "#BF3636", size: 30 },
    // ... more dreams
];

// Set the initial dimensions and margins of the graph
var margin = { top: 10, right: 30, bottom: 30, left: 40 },
    width = document.getElementById("my_dataviz").clientWidth - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// Define scales and SVG container globally
var x = d3.scaleLinear().range([0, width]).domain([0, 100]),
    y = d3.scaleLinear().range([height, 0]).domain([0, 100]);

var svg = d3.select("#my_dataviz").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    function updateChart() {
        // Update width and height based on the new window size
        width = document.getElementById("my_dataviz").clientWidth - margin.left - margin.right;
        height = document.getElementById("my_dataviz").clientHeight - margin.top - margin.bottom; // You may need to define a clientHeight for your container
    
        // Update the scales
        x.range([0, width]);
        y.range([height, 0]); // Update the y-scale if the height changes
    
        // Update SVG dimensions
        d3.select("#my_dataviz").select("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);
    
        // Update the x-axis position
        svg.select(".x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));
    
        // Update the y-axis in case the height has changed
        svg.select(".y-axis").call(d3.axisLeft(y));
    
        // Update the circles' positions in case the scale has changed
        svg.selectAll("circle")
            .attr("cx", function(d) { return x(d.x); })
            .attr("cy", function(d) { return y(d.y); });
    }

// Append the initial X and Y axes
svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .attr("class", "x-axis");

svg.append("g")
    .call(d3.axisLeft(y));

// Add the initial dots
svg.append('g')
    .selectAll("dot")
    .data(dreams)
    .enter()
    .append("circle")
    .attr("cx", function (d) { return x(d.x); })
    .attr("cy", function (d) { return y(d.y); })
    .attr("r", function (d) { return d.size; })
    .style("fill", function (d) { return d.color; })
    .on('click', function(event, d) {
        // Call the function defined in your HTML file, passing the name of the clicked element
        processArrayElementByName(d.name);
        displayData(d);
    });

// Define the displayData function that updates the HTML content
function displayData(data) {
    // Assuming you have a div with id='dataDisplay' in your HTML
    document.getElementById('dataDisplay').innerHTML = 'Name: ' + data.name + ', X: ' + data.x + ', Y: ' + data.y + ', Color: ' + data.color + ', Size: ' + data.size;
}

// Initial update to configure everything correctly
updateChart();

// Listen to resize events
window.addEventListener("resize", updateChart);
