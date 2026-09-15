let squares = [];
let gridSize = 20;
let squareSize = 15;
let waveRadius = 0;
let waveSpeed = 2;
let waveCenter = { x: 0, y: 0 };
let gridOffsetX = 0;
let gridOffsetY = 0;

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();

  // Initialize grid of squares
  for (let y = 0; y < height; y += gridSize) {
    for (let x = 0; x < width; x += gridSize) {
      let square = {
        x: x,
        y: y,
        size: squareSize,
        pulse: random(1),
        pulseSpeed: random(0.005, 0.015),
        originalHue: random(360),
        baseBrightness: random(20, 40)
      };
      squares.push(square);
    }
  }

  gridOffsetX = (width - (squares.length / (height / gridSize)) * gridSize) / 2;
  gridOffsetY = (height - (height / gridSize) * gridSize) / 2;
}

function draw() {
  background(10, 10, 10); // Near-black background

  // Update and display squares
  for (let i = 0; i < squares.length; i++) {
    let square = squares[i];
    
    // Pulsate with own rhythm
    square.pulse += square.pulseSpeed;
    let pulseSize = sin(square.pulse) * 2 + square.size;
    
    // Check if wave is passing through this square
    let d = dist(square.x, square.y, waveCenter.x, waveCenter.y);
    if (d < waveRadius && d > waveRadius - 30) {
      // Distort pulse rhythm
      let distortion = map(d, waveRadius - 30, waveRadius, 0.05, 0);
      square.pulseSpeed = distortion + random(-0.01, 0.01);
    }

    // Draw square with pulsating effect
    fill(square.originalHue, 80, square.baseBrightness + sin(square.pulse) * 20, 0.8);
    rect(square.x - pulseSize / 2 + gridOffsetX, square.y - pulseSize / 2 + gridOffsetY, pulseSize, pulseSize);
  }

  // Update wave
  waveRadius += waveSpeed;
  
  // Reset wave if it goes off screen
  if (waveRadius > max(width, height)) {
    waveRadius = 0;
  }
}

function mousePressed() {
  waveCenter.x = mouseX;
  waveCenter.y = mouseY;
  waveRadius = 0;
}
