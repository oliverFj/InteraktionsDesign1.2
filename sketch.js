// Define variables for sliders
let sliderOne; // Controls the size of the circles
let sliderTwo; // Controls the randomness of circle positions
let sliderThree; // Controls the speed of circle movement
let sliderFour; // Controls the threshold for drawing lines between circles
let colorPicker;

let circles = []; // Array to store the positions of the circles

let sliderOpacity; // Declare a variable for the opacity slider

function setup() {
    // Assuming 'sketch-holder' is the ID of the container in your HTML
    let sketchHolder = document.getElementById('sketch-holder');
    let cnvWidth = sketchHolder.offsetWidth;
    let cnvHeight = sketchHolder.offsetHeight;

    let cnv = createCanvas(cnvWidth, cnvHeight);
    cnv.parent('sketch-holder'); // Move the canvas to the sketch-holder div

    colorMode(HSB, 360, 100, 100, 100);

    // Linking p5.js variables to HTML slider elements
    sliderOne = select('#circleSizeSlider'); // Size slider
    sliderTwo = select('#randomnessSlider'); // Randomness slider
    sliderThree = select('#speedSlider'); // Speed slider
    sliderFour = select('#thresholdSlider'); // Threshold slider
    sliderOpacity = select('#opacitySlider'); // Opacity slider
    colorPicker = select('#colorSelector'); // Color picker

    // Remove the positioning as it is not necessary for DOM elements
    // Remove the slider creation as they are already present in the HTML

    // Generate circles
    for (let i = 0; i < 40; i++) {
        let radius = 50;
        let angle = map(i, 0, 20, 0, TWO_PI);
        circles[i] = {
            originalX: width / 2 + radius * cos(angle),
            originalY: height / 2 + radius * sin(angle),
            randomX: 0,
            randomY: 0,
            noiseOffsetX: random(0, 1000),
            noiseOffsetY: random(1000, 2000),
            color: null // New property for circle color
        };
        setColorVariation(circles[i]);
    }

    colorPicker.input(() => {
        circles.forEach(circle => {
            setColorVariation(circle);
        });
    });
}

function draw() {
    background(220);




    // Adjust circle and line drawing code to apply opacity
    for (let circle of circles) {
        let randomness = sliderTwo.value();
        circle.randomX = noise(circle.noiseOffsetX + frameCount * sliderThree.value()) * randomness - randomness / 2;
        circle.randomY = noise(circle.noiseOffsetY + frameCount * sliderThree.value()) * randomness - randomness / 2;
        let x = circle.originalX + circle.randomX;
        let y = circle.originalY + circle.randomY;

        // Apply the opacity directly here
        let currentOpacity = sliderOpacity.value();
        fill(hue(circle.color), saturation(circle.color), brightness(circle.color), currentOpacity);
        ellipse(x, y, sliderOne.value(), sliderOne.value());

        // Adjust line drawing to apply opacity
        for (let other of circles) {
            if (other === circle) continue; // Skip self
            strokeWeight(sliderOne.value());
            // Apply opacity to stroke as well
            stroke(hue(circle.color), saturation(circle.color), brightness(circle.color), currentOpacity / 4);
            let otherX = other.originalX + other.randomX;
            let otherY = other.originalY + other.randomY;
            let distance = dist(x, y, otherX, otherY);
            if (distance < sliderFour.value()) {
                line(x, y, otherX, otherY);
            }
        }
    }
}

function setColorVariation(circle) {
    let baseColor = colorPicker.value(); // Get the color value as a string
    let rgbColor = color(baseColor); // Convert the string to a p5 color

    colorMode(HSB); // Ensure color mode is HSB for consistency

    let h = hue(rgbColor);
    let s = saturation(rgbColor);
    let b = brightness(rgbColor);

    // Create a slight variation in brightness for each circle
    let brightnessVariation = map(noise(circle.noiseOffsetX), 0, 1, -15, 15);
    circle.color = color(h, s, b + brightnessVariation); // No alpha value here
}


function windowResized() {
    let sketchHolder = document.getElementById('sketch-holder');
    let cnvWidth = sketchHolder.offsetWidth;
    let cnvHeight = sketchHolder.offsetHeight;

    resizeCanvas(cnvWidth, cnvHeight);

    // Calculate the new center of the canvas
    let newCenterX = cnvWidth / 2;
    let newCenterY = cnvHeight / 2;

    // Update the position of each circle relative to the new center
    let radius = 50; // Assuming the radius for your shape layout remains constant
    for (let i = 0; i < circles.length; i++) {
        let angle = map(i, 0, circles.length, 0, TWO_PI);
        circles[i].originalX = newCenterX + radius * cos(angle);
        circles[i].originalY = newCenterY + radius * sin(angle);
    }
}