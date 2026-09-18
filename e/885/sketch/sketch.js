let grid;
let patternOffset = 0;
let rippleCenter = { x: 0, y: 0 };
let rippleTime = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  noStroke();
  
  // Create a grid of pattern elements
  grid = [];
  const cellSize = 60;
  const cols = Math.ceil(width / cellSize) + 2;
  const rows = Math.ceil(height / cellSize) + 2;
  
  for (let y = 0; y < rows; y++) {
    grid[y] = [];
    for (let x = 0; x < cols; x++) {
      grid[y][x] = {
        x: x * cellSize,
        y: y * cellSize,
        angle: random(TWO_PI),
        size: random(20, 40)
      };
    }
  }
}

function draw() {
  // Slowly drift the pattern
  patternOffset += 0.001;
  
  // Draw background with gradient
  drawBackground();
  
  // Draw grid pattern
  drawPattern();
  
  // Handle ripple effect
  if (rippleTime > 0) {
    drawRipple();
    rippleTime--;
  }
}

function drawBackground() {
  // Create a deep blue gradient background
  loadPixels();
  for (let y = 0; y < height; y++) {
    const inter = map(y, 0, height, 0, 1);
    const c = lerpColor(color(10, 15, 40), color(20, 30, 60), inter);
    for (let x = 0; x < width; x++) {
      set(x, y, c);
    }
  }
  updatePixels();
}

function drawPattern() {
  const cellSize = 60;
  
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const element = grid[y][x];
      
      // Calculate position with subtle animation
      const timeOffset = patternOffset + (x + y) * 0.1;
      const offsetX = sin(timeOffset) * 5;
      const offsetY = cos(timeOffset) * 5;
      
      // Create a stylized floral motif
      push();
      translate(element.x + offsetX, element.y + offsetY);
      
      // Apply rotation based on position and time
      const rotation = element.angle + patternOffset * 0.5 + (x + y) * 0.1;
      rotate(rotation);
      
      // Draw geometric elements with jewel tones
      drawFloralMotif(element.size, x, y);
      pop();
    }
  }
}

function drawFloralMotif(size, x, y) {
  const hue = (x * 13 + y * 7) % 360;
  
  // Base color with jewel tones
  const baseColor = color(hue, 80, 70);
  
  // Create multiple layers for depth
  noFill();
  strokeWeight(2);
  
  // Draw central circle
  fill(baseColor);
  stroke(baseColor);
  ellipse(0, 0, size * 0.3);
  
  // Draw petal shapes around it
  strokeWeight(1);
  noFill();
  
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * TWO_PI;
    const px = cos(angle) * size * 0.4;
    const py = sin(angle) * size * 0.4;
    
    // Petal shape
    beginShape();
    curveVertex(0, 0);
    curveVertex(px * 0.5, py * 0.5);
    curveVertex(px * 0.8, py * 0.8);
    curveVertex(px, py);
    endShape();
  }
  
  // Draw connecting lines to form a lattice
  strokeWeight(0.5);
  for (let i = 0; i < 6; i++) {
    const angle1 = (i / 6) * TWO_PI;
    const angle2 = ((i + 1) % 6 / 6) * TWO_PI;
    
    const x1 = cos(angle1) * size * 0.4;
    const y1 = sin(angle1) * size * 0.4;
    const x2 = cos(angle2) * size * 0.4;
    const y2 = sin(angle2) * size * 0.4;
    
    line(x1, y1, x2, y2);
  }
}

function drawRipple() {
  // Draw a ripple effect centered at the click point
  noFill();
  strokeWeight(3);
  
  for (let i = 0; i < 5; i++) {
    const r = (rippleTime - i) * 10;
    if (r > 0) {
      const alpha = map(i, 0, 4, 255, 0);
      stroke(255, 255, 200, alpha);
      ellipse(rippleCenter.x, rippleCenter.y, r * 2);
    }
  }
}

function mousePressed() {
  // Trigger a ripple effect at the click point
  rippleCenter = { x: mouseX, y: mouseY };
  rippleTime = 30;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
