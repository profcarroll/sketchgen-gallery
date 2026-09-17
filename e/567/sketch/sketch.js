let grid = [];
let gridSize = 20;
let squareSize = 20;
let wavePulses = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Initialize grid
  for (let y = 0; y < height; y += gridSize) {
    for (let x = 0; x < width; x += gridSize) {
      grid.push({
        x: x,
        y: y,
        size: squareSize,
        pulse: 0,
        baseSize: squareSize
      });
    }
  }
}

function draw() {
  background(10);
  
  // Update and display grid squares
  for (let i = 0; i < grid.length; i++) {
    let square = grid[i];
    
    // Apply breathing motion
    let pulse = sin(frameCount * 0.02 + i * 0.05) * 0.3;
    square.size = square.baseSize + pulse * 2;
    
    // Apply wave pulse effect if exists
    if (square.pulse > 0) {
      square.pulse -= 0.02;
      let alpha = map(square.pulse, 0, 1, 0, 255);
      fill(255, alpha);
      noStroke();
      rect(square.x, square.y, square.size, square.size);
    } else {
      // Draw normal square
      noFill();
      stroke(200, 100);
      rect(square.x, square.y, square.size, square.size);
    }
  }
  
  // Update wave pulses
  for (let i = wavePulses.length - 1; i >= 0; i--) {
    let pulse = wavePulses[i];
    pulse.radius += 2;
    if (pulse.radius > max(width, height)) {
      wavePulses.splice(i, 1);
    } else {
      stroke(255, 100);
      noFill();
      ellipse(pulse.x, pulse.y, pulse.radius * 2);
    }
  }
}

function mousePressed() {
  // Start a new wave pulse at the click position
  wavePulses.push({
    x: mouseX,
    y: mouseY,
    radius: 0
  });
  
  // Apply pulse effect to nearby squares
  for (let i = 0; i < grid.length; i++) {
    let square = grid[i];
    let d = dist(mouseX, mouseY, square.x + square.size/2, square.y + square.size/2);
    if (d < 150) {
      square.pulse = 1;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
