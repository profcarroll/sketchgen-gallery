let yarn = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create a massive tapestry of knitted yarn fibers
  for (let i = 0; i < 2000; i++) {
    yarn.push({
      x: random(-width * 2, width * 2),
      y: random(-height * 2, height * 2),
      z: random(-1000, 1000),
      size: random(0.5, 3),
      hue: random(200, 240),
      saturation: random(60, 80),
      brightness: random(70, 90),
      speed: random(0.001, 0.005),
      angle: random(TWO_PI),
      opacity: random(0.3, 0.7)
    });
  }
}

function draw() {
  background(200, 80, 10);
  
  // Create a deep blue gradient background
  drawGradient();
  
  // Draw the knitted yarn tapestry
  drawYarn();
  
  time += 0.002;
}

function drawGradient() {
  // Create a vast oceanic gradient for the backdrop
  for (let y = -height/2; y < height/2; y += 10) {
    let inter = map(y, -height/2, height/2, 0, 1);
    let c = lerpColor(color(200, 80, 5), color(200, 90, 15), inter);
    stroke(c);
    line(-width/2, y, width/2, y);
  }
}

function drawYarn() {
  // Use additive blending to create glowing yarn effect
  blendMode(ADD);
  
  noStroke();
  
  beginShape(POINTS);
  for (let strand of yarn) {
    // Animate yarn strands with noise and time
    let nX = noise(strand.x * 0.001, strand.y * 0.001, time * 0.5) * 2;
    let nY = noise(strand.x * 0.001 + 1000, strand.y * 0.001 + 1000, time * 0.5) * 2;
    
    // Update position
    strand.x += cos(strand.angle) * strand.speed + nX;
    strand.y += sin(strand.angle) * strand.speed + nY;
    
    // Wrap around edges to create endless tapestry
    if (strand.x > width * 2) strand.x = -width * 2;
    if (strand.x < -width * 2) strand.x = width * 2;
    if (strand.y > height * 2) strand.y = -height * 2;
    if (strand.y < -height * 2) strand.y = height * 2;
    
    // Set yarn color and vertex
    fill(strand.hue, strand.saturation, strand.brightness, strand.opacity);
    vertex(strand.x, strand.y, strand.z);
  }
  endShape();
  
  blendMode(BLEND);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
