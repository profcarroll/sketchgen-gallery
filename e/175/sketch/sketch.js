let planes = [];
const NUM_PLANES = 100;
const GRID_SIZE = 50;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Initialize planes with random positions and velocities
  for (let i = 0; i < NUM_PLANES; i++) {
    planes.push({
      x: random(width),
      y: random(height),
      size: random(50, 200),
      speed: random(0.1, 0.5),
      hue: random(360),
      alpha: random(0.1, 0.3),
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5),
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  background(0, 0, 0, 0.05); // Semi-transparent background for trail effect

  // Update and display each plane
  for (let i = 0; i < planes.length; i++) {
    let p = planes[i];
    
    // Slow drift motion
    p.x += p.vx * p.speed;
    p.y += p.vy * p.speed;
    
    // Add some periodic movement to create variable velocity zones
    p.x += sin(frameCount * 0.01 + p.phase) * 0.2;
    p.y += cos(frameCount * 0.01 + p.phase) * 0.2;
    
    // Wrap around edges
    if (p.x < -p.size) p.x = width + p.size;
    if (p.x > width + p.size) p.x = -p.size;
    if (p.y < -p.size) p.y = height + p.size;
    if (p.y > height + p.size) p.y = -p.size;

    // Apply a subtle color shift over time
    p.hue = (p.hue + 0.1) % 360;

    // Draw the glowing plane
    fill(p.hue, 80, 90, p.alpha);
    drawAmorphousPlane(p.x, p.y, p.size);
  }
}

function drawAmorphousPlane(x, y, size) {
  // Create a soft, amorphous glow using multiple overlapping ellipses
  push();
  translate(x, y);
  
  // Draw several layers of expanding ellipses to simulate a glowing field
  for (let i = 0; i < 5; i++) {
    let s = size * (1 - i * 0.15);
    let a = map(i, 0, 4, 0.2, 0.05);
    fill(0, 0, 100, a);
    ellipse(0, 0, s, s);
  }
  
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
