/**
 * Initialiserer et D3-diagram med drømmedata.
 * 
 * @param {Array} dreamData - Et array med drømmedata.
 * @returns {Object} - Et objekt med en metode til at opdatere diagrammet.
 */


/*
    example array: min and max values for reference
    "name": string
    "size": min="10" max="100"
    "randomness": min="0" max="500"
    "speed": min="0.000" max="0.01"
    "threshold": min="0" max="100"
    "opacity": min="0" max="100"
    "color": rgb

*/



function initializeD3Chart(dreamData) {

    // Funktion til at mappe en værdi til et nyt interval
    // Det betyder at vi tager en værdi, der er i et interval, og mapper den til et nyt interval
    // interval er et andet ord for område eller rækkevidde af værdier. Fra det mindste til det største.

    // value er den værdi, vi vil mappe til det nye interval
    // currentMin og currentMax er det nuværende interval, som value er i
    // targetMin og targetMax er det nye interval, som value skal mappes til
    function mapValueToRange(value, currentMin, currentMax, targetMin, targetMax) {
        return ((value - currentMin) / (currentMax - currentMin)) * (targetMax - targetMin) + targetMin;
    }

    // Funktion til at mappe værdierne i et objekt til et nyt interval
    // Vi bruger denne funktion til at mappe værdierne i drømmedataene til det interval, vi vil bruge i diagrammet
    // Det er en måde at transformere dataene, så de passer til det, vi vil vise i diagrammet
    // size er foreksempel en værdi mellem 10 og 100, der skal mappes til et interval mellem 10 og 50
    function mapValuesToRange(values) {
        return {
            name: values.name,
            x: mapValueToRange(values.randomness, 0, 500, 0, 100),
            y: mapValueToRange(values.speed, 0.000, 0.01, 0, 100),
            size: mapValueToRange(values.size, 10, 100, 10, 50),
            opacity: mapValueToRange(values.opacity, 0, 100, 0.2, 1), 
            color: values.color
        };
    }

    // Definér margener og størrelse på diagrammet
    // Margenerne er de tomme rum omkring diagrammet
    // Vi bruger dem til at placere akserne og diagrammet korrekt på siden
    // Vi bruger også dem til at justere størrelsen på diagrammet, når vinduet ændrer størrelse
    var margin = { top: 10, right: 30, bottom: 30, left: 40 },
        width = document.getElementById("drommegraf").clientWidth - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // Skaleringsfunktioner for x- og y-aksen
    // Skaleringsfunktioner er funktioner, der tager en værdi og mapper den til et nyt interval
  
    var x = d3.scaleLinear().range([0, width]).domain([0, 100]),
        y = d3.scaleLinear().range([height, 0]).domain([0, 100]);

    // Opret SVG-elementet til diagrammet
    // .attr er en metode til at tilføje attributter til et element
    // Vi tilføjer width og height til svg-elementet
    // Vi tilføjer også et g-element til svg-elementet, som vi bruger til at gruppere elementer i diagrammet
    // med elementer mener vi cirkler, akser og andet, der skal vises i diagrammet

    var svg = d3.select("#drommegraf").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Funktion til at opdatere diagrammet med nye data
    // Vi bruger denne funktion til at tilføje nye cirkler til diagrammet, når der kommer nye data
    // Vi bruger også denne funktion til at fjerne cirkler, der ikke længere er i data

    function updateChart(newData) {
        if (newData) {
            // Map de nye data til det ønskede interval
            var processedDreams = newData.map(d => mapValuesToRange(d));
            var circle = svg.selectAll("circle").data(processedDreams);

            // Tilføj nye cirkler for de nye data
            var enterCircle = circle.enter().append("circle")
                .attr("cx", d => x(d.x))
                .attr("cy", d => y(d.y))
                .attr("r", d => d.size)
                .style("fill", d => d.color)
                .style("fill-opacity", d => d.opacity) 
                .on('click', (event, d) => {
                    processArrayElementByName(d.name);
                   // displayData(d);
                })
                .on('mouseover', function (event, d) {
                    d3.select(this).transition()
                        .duration(100)
                        .attr("r", d.size * 1.5);
                })
                .on('mouseout', function (event, d) {
                    d3.select(this).transition()
                        .duration(100)
                        .attr("r", d.size);
                });

            // Opdater eksisterende cirkler med nye data
            circle.call(update => update.transition()
                                        .attr("cx", d => x(d.x))
                                        .attr("cy", d => y(d.y))
                                        .attr("r", d => d.size)
                                        .style("fill", d => d.color)
                                        .style("fill-opacity", d => d.opacity)); 

            // Fjern cirkler, der ikke længere er i data
            circle.exit().remove();
        }

        // Opdater bredden af diagrammet ved ændring af vinduets størrelse
        width = document.getElementById("drommegraf").clientWidth - margin.left - margin.right;
        x.range([0, width]);
        svg.select("#drommegraf svg").attr("width", width + margin.left + margin.right);
        svg.select(".x-axis").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
        svg.select(".y-axis").call(d3.axisLeft(y));
    }

    // Tilføj x- og y-akse til diagrammet
    svg.append("g")
       .attr("transform", "translate(0," + height + ")")
       .call(d3.axisBottom(x))
       .attr("class", "x-axis");

    svg.append("g")
       .call(d3.axisLeft(y));

    // Funktion til at vise data for en cirkel ved klik
    function displayData(data) {
        // Opdater teksten under grafen med data for cirklen 
        document.getElementById('dataDisplay').innerHTML = `Name: ${data.name}, X: ${data.x}, Y: ${data.y}, Color: ${data.color}, Size: ${data.size}`;
    }

    // Opdater diagrammet med de initialiserede data
    updateChart(dreamData);

    // Lyt efter ændringer i vinduets størrelse og opdater diagrammet
    window.addEventListener("resize", () => updateChart(dreamData));

    // Returnér metoden til at opdatere diagrammet
    return {
        updateChart: updateChart
    };
}
