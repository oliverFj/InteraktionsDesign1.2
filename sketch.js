// Definer variabler for sliders
let sliderOne; // størrelsen af cirklerne
let sliderTwo; // tilfældigheden af cirkelpositioner
let sliderThree; // hastigheden af cirkelbevægelse
let sliderFour; // tærsklen for at tegne linjer mellem cirkler
let colorPicker; // farven på cirklerne

let circles = []; // Array til at gemme positionerne af cirklerne

let sliderOpacity; // Deklarer en variabel til gennemsigtighedsskyderen

function setup() {
    // 'sketch-holder' er ID'en på beholderen i HTML filen.
    let sketchHolder = document.getElementById('sketch-holder');
    let cnvWidth = sketchHolder.offsetWidth;
    let cnvHeight = sketchHolder.offsetHeight;

    let cnv = createCanvas(cnvWidth, cnvHeight);
    cnv.parent('sketch-holder');

    // HSB betyder Hue, Saturation, Brightness
    // Det er en anden måde at repræsentere farver på end RGB
    colorMode(HSB, 360, 100, 100, 100);

    // Link p5.js variabler til HTML sliders
    sliderOne = select('#circleSizeSlider'); // Størrelse
    sliderTwo = select('#randomnessSlider'); // Tilfældighed
    sliderThree = select('#speedSlider'); // Hastighed
    sliderFour = select('#thresholdSlider'); // Tærskel
    sliderOpacity = select('#opacitySlider'); // Gennemsigtighed
    colorPicker = select('#colorSelector'); // Farve

    // Generer cirkler
    // Det gør vi ved at bruge en for-loop til at oprette 40 cirkler

    // Hver cirkel får en position på en cirkel omkring midten af lærredet
    // Vi gemmer positionen for hver cirkel i et objekt og gemmer objektet i et array
    // Vi bruger også perlin noise til at skabe en tilfældig bevægelse for hver cirkel
    // Den tilfældige bevægelse er baseret på en offset, der ændrer sig over tid
    // Vi bruger også en funktion til at tilføje en lille variation i farven for hver cirkel

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
            color: null 
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

    // Juster cirkel- og linjetegningskoden til at anvende gennemsigtighed
    // Fordi vi vil have cirklerne og linjerne til at have forskellig gennemsigtighed (fordi det ser pænest ud)
    // Vi vil også have at cirklerne og linjerne har samme farve
    // Vi bruger en for-loop til at tegne hver cirkel og justere dens position baseret på perlin noise

    for (let circle of circles) {
        let randomness = sliderTwo.value();

        //perlin noise til at skabe en tilfældig bevægelse
        //perlin noise er en metode til at skabe tilfældige værdier, der ændrer sig flydende over tid
        //Det er nyttigt til at skabe realistiske tilfældige bevægelser i animationer
        circle.randomX = noise(circle.noiseOffsetX + frameCount * sliderThree.value()) * randomness - randomness / 2;
        circle.randomY = noise(circle.noiseOffsetY + frameCount * sliderThree.value()) * randomness - randomness / 2;
        let x = circle.originalX + circle.randomX;
        let y = circle.originalY + circle.randomY;

        // Anvend gennemsigtigheden direkte her
        let currentOpacity = sliderOpacity.value();
        fill(hue(circle.color), saturation(circle.color), brightness(circle.color), currentOpacity);
        ellipse(x, y, sliderOne.value(), sliderOne.value());

        // Juster linjetegning til at anvende gennemsigtighed
        for (let other of circles) {
            if (other === circle) continue;
            strokeWeight(sliderOne.value());
            // Anvend gennemsigtighed til streger
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

// laver en lille forskel i farven på cirklerne
// denne kode er i en separat funktion, så vi kan kalde den igen, når farven ændres
// i andre projekter kan du bruge denne funktion til at ændre farven på en genstand(circle), 
// når den foreksempel bliver klikket på.
function setColorVariation(circle) {
    let baseColor = colorPicker.value(); // Få farveværdien som en string
    let rgbColor = color(baseColor); // Konverter string til en p5 farve

    colorMode(HSB); // Sørg for at farvetilstand er HSB fordi vi vil ændre lysstyrken

    let h = hue(rgbColor);
    let s = saturation(rgbColor);
    let b = brightness(rgbColor);

    // Skab en lille variation i lysstyrken for hver cirkel for at gøre dem forskellige
    let brightnessVariation = map(noise(circle.noiseOffsetX), 0, 1, -15, 15);
    circle.color = color(h, s, b + brightnessVariation); 
}

// sørger for at figuren altid er centreret i forhold til skærmstørrelsen. 
// det er en god ide at have denne funktion i alle dine p5.js projekter

function windowResized() {
    let sketchHolder = document.getElementById('sketch-holder');
    let cnvWidth = sketchHolder.offsetWidth;
    let cnvHeight = sketchHolder.offsetHeight;

    resizeCanvas(cnvWidth, cnvHeight);

    // Beregn det nye centrum af lærredet
    let newCenterX = cnvWidth / 2;
    let newCenterY = cnvHeight / 2;

    // Opdater positionen for hver cirkel i forhold til det nye centrum
    let radius = 50; // Antager at radius for din form-layout forbliver konstant
    for (let i = 0; i < circles.length; i++) {
        let angle = map(i, 0, circles.length, 0, TWO_PI);
        circles[i].originalX = newCenterX + radius * cos(angle);
        circles[i].originalY = newCenterY + radius * sin(angle);
    }
}
