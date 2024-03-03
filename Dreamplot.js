// Her har jeg en anden array, lige som den i index.html.
// Det er egentlig lidt noget sjusk at have to arrays, for de burde bare bruge den samme data.
// Men det her var hurtigere i øjeblikket, og betyder ikke super meget. Hvis jeg havde et par
// dage mere, ville jeg lave det om og koble det hele til en database.

var dreams = [
    { name: "Naptime Nonsense", x: 40, y: 20, color: "#C20CDB", size: 10 },
    { name: "Snooze Fest", x: 15, y: 40, color: "#639AA6", size: 50 },
    { name: "Dreamland Doodles", x: 85, y: 55, color: "#0339A6", size: 30 },
    { name: "Slumberland Shenanigans", x: 6, y: 60, color: "#F2B138", size: 15},
    { name: "Odyssey of the Mind", x: 50, y: 90, color: "#574B13", size: 20 },
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
