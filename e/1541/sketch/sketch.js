let stripes = [];
const numStripes = 30;
const colors = [
  [255, 50, 50],   // Red
  [50, 255, 50],   // Green
  [50, 50, 255],   // Blue
  [255, 255, 50],  // Yellow
  [255, 50, 255],  // Magenta
  [50, 255, 255]   // Cyan
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Initialize stripes with random properties
  for (let i = 0; i < numStripes; i++) {
    stripes.push({
      angle: random(TWO_PI),
      speed: random(0.002, 0.01),
      size: random(0.15, 0.35),
      color: random(colors),
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  background(0);
  
  // Draw each stripe as a rotating rectangle
  for (let i = 0; i < stripes.length; i++) {
    const s = stripes[i];
    
    push();
    translate(width / 2, height / 2);
    rotate(s.angle + sin(frameCount * s.speed + s.phase) * 0.8);
    
    // Calculate size with oscillation
    const oscillation = sin(frameCount * s.speed * 0.5 + s.phase) * 0.4 + 0.6;
    const w = width * s.size * oscillation;
    const h = height * s.size * oscillation;
    
    fill(s.color[0], s.color[1], s.color[2]);
    rect(-w/2, -h/2, w, h);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
