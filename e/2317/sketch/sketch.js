let plankton = [];
const PLANKTON_COUNT = 1500;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Initialize plankton with varied properties
  for (let i = 0; i < PLANKTON_COUNT; i++) {
    plankton.push({
      x: random(width),
      y: random(height),
      size: random(2, 8),
      speedX: 0,
      speedY: 0,
      hue: random(180, 240),
      saturation: random(60, 90),
      brightness: random(70, 100),
      opacity: random(0.3, 0.7),
      angle: random(TWO_PI),
      rotation: random(-0.02, 0.02),
      life: random(100)
    });
  }
}

function draw() {
  // Semi-transparent background for trail effect
  background(210, 50, 10, 0.03);
  
  time += 0.005;
  
  // Update and draw all plankton
  for (let i = 0; i < plankton.length; i++) {
    let p = plankton[i];
    
    // Apply slow circular current effect
    let currentX = cos(time + p.x * 0.001) * 0.2;
    let currentY = sin(time + p.y * 0.001) * 0.2;
    
    // Update position with current and slight random drift
    p.x += currentX + random(-0.1, 0.1);
    p.y += currentY + random(-0.1, 0.1);
    
    // Apply rotation
    p.angle += p.rotation;
    
    // Boundary wrapping - plankton wraps around edges
    if (p.x < -20) p.x = width + 20;
    if (p.x > width + 20) p.x = -20;
    if (p.y < -20) p.y = height + 20;
    if (p.y > height + 20) p.y = -20;
    
    // Draw plankton as glowing, semi-transparent shape
    push();
    translate(p.x, p.y);
    rotate(p.angle);
    
    fill(p.hue, p.saturation, p.brightness, p.opacity);
    
    // Draw as a soft, organic blob
    beginShape();
    let points = 8;
    for (let j = 0; j < points; j++) {
      let angle = map(j, 0, points, 0, TWO_PI);
      let px = cos(angle) * p.size * (0.8 + noise(p.x * 0.01, p.y * 0.01, time) * 0.4);
      let py = sin(angle) * p.size * (0.8 + noise(p.x * 0.01, p.y * 0.01, time) * 0.4);
      vertex(px, py);
    }
    endShape(CLOSE);
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
