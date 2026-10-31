let smokePlumes = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create smoke plumes with varying properties
  for (let i = 0; i < 50; i++) {
    smokePlumes.push({
      x: random(-width * 0.8, width * 0.8),
      y: height * 0.4,
      z: random(-1000, -300),
      size: random(20, 60),
      speed: random(0.5, 1.5),
      hue: random(20, 40), // Warm hues for smoke
      saturation: random(30, 60),
      brightness: random(50, 90),
      sway: random(TWO_PI),
      swaySpeed: random(0.01, 0.03),
      opacity: random(0.2, 0.6)
    });
  }
}

function draw() {
  background(20, 5, 5); // Deep sea darkness
  time += 0.01;

  // Draw smoke plumes with a knitted wool effect
  for (let plume of smokePlumes) {
    drawSmokePlume(plume);
  }
}

function drawSmokePlume(plume) {
  push();
  translate(plume.x, plume.y, plume.z);

  // Animate the plume
  plume.z += plume.speed;
  plume.sway += plume.swaySpeed;
  plume.x += sin(plume.sway) * 0.5;

  // Draw a knitted wool-like structure using multiple layers
  noStroke();
  for (let i = 0; i < 10; i++) {
    let layerSize = plume.size * (1 - i * 0.08);
    let alpha = plume.opacity * (1 - i * 0.1);
    
    fill(plume.hue, plume.saturation, plume.brightness, alpha);
    sphere(layerSize, 4, 3); // Low detail for performance
  }

  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
