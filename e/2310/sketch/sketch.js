let strata = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Create deep-sea sediment layers with abrupt color shifts
  for (let i = 0; i < 80; i++) {
    strata.push({
      y: random(height),
      height: random(20, 60),
      hue: random(200, 260), // Deep blue to deep purple
      saturation: random(60, 80),
      brightness: random(10, 30),
      alpha: random(0.2, 0.5),
      speed: random(0.0005, 0.002),
      flow: random(-0.001, 0.001),
      // Add banding and asymmetry
      bandWidth: random(5, 30),
      transitionOffset: random(TWO_PI)
    });
  }
}

function draw() {
  background(0, 0, 0, 0.05); // Semi-transparent background for trail effect

  time += 0.01;

  // Draw sediment strata
  for (let i = 0; i < strata.length; i++) {
    let s = strata[i];
    
    // Create abrupt color shifts using step function on time
    const transitionStep = floor(time * 0.2) % 4;
    let currentHue = s.hue + (transitionStep * 90);
    
    // Apply flow movement to each stratum
    let offset = sin(time * s.speed * 100 + s.transitionOffset) * 50;
    
    push();
    translate(0, s.y);
    
    fill(currentHue % 360, s.saturation, s.brightness, s.alpha);
    
    // Draw a banding pattern that flows and shifts
    beginShape();
    for (let x = -width; x < width * 2; x += 10) {
      let y = sin(x * 0.01 + time * s.flow * 500 + offset) * s.bandWidth;
      vertex(x, y);
    }
    vertex(width * 2, height);
    vertex(-width, height);
    endShape(CLOSE);

    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
