let waves = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  colorMode(HSB, 360, 100, 100, 1);

  // Initialize waves with consistent cobalt/blue tones
  for (let i = 0; i < 800; i++) {
    waves.push({
      x: random(width),
      y: random(height),
      radius: random(15, 60),
      speed: random(0.002, 0.008),
      phase: random(TWO_PI),
      hue: random(220, 250) // Cobalt to indigo range
    });
  }
}

function draw() {
  background(240, 100, 5); // Dark blue background
  time += 0.01;

  // Draw waves with fluid motion and color blending
  for (let i = 0; i < waves.length; i++) {
    let w = waves[i];
    
    // Calculate wave value with smooth pulsing
    let val = sin(time * w.speed + w.phase);
    
    // Apply subtle scaling based on wave value
    let scl = 1 + val * 0.3;
    
    // Use consistent blue/indigo color range
    let sat = 70 + val * 20;
    let bright = 40 + val * 30;
    
    fill(w.hue, sat, bright, 0.6);
    
    // Draw wave with smooth, organic movement
    push();
    translate(w.x, w.y);
    scale(scl);
    ellipse(0, 0, w.radius * scl, w.radius * scl);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
