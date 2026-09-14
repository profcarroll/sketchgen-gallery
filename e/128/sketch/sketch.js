let grid = [];
let squareSize = 20;
let gridSizeX = 30;
let gridSizeY = 20;
let waveRadius = 0;
let waveSpeed = 1;
let waveCenter = { x: 0, y: 0 };
let isWaveActive = false;

function setup() {
  createCanvas(600, 400);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  for (let y = 0; y < gridSizeY; y++) {
    grid[y] = [];
    for (let x = 0; x < gridSizeX; x++) {
      grid[y][x] = {
        hue: random(360),
        saturation: 80 + random(20),
        brightness: 50 + random(30),
        pulseSpeed: random(0.01, 0.03),
        pulseOffset: random(TWO_PI),
        flashColor: null,
        isFlashing: false
      };
    }
  }
}

function draw() {
  background(10);
  
  for (let y = 0; y < gridSizeY; y++) {
    for (let x = 0; x < gridSizeX; x++) {
      let square = grid[y][x];
      
      // Calculate pulse value
      let pulseValue = sin(frameCount * square.pulseSpeed + square.pulseOffset);
      let brightness = square.brightness + pulseValue * 20;
      
      // Handle flashing
      if (square.isFlashing) {
        fill(square.flashColor);
        square.isFlashing = false; // Reset flash after one frame
      } else {
        fill(square.hue, square.saturation, brightness);
      }
      
      rect(x * squareSize, y * squareSize, squareSize, squareSize);
    }
  }
  
  // Draw wave if active
  if (isWaveActive) {
    stroke(255, 0.7);
    noFill();
    ellipse(waveCenter.x, waveCenter.y, waveRadius * 2);
    waveRadius += waveSpeed;
    
    // Check if wave has passed all squares
    let maxDist = dist(0, 0, width, height);
    if (waveRadius > maxDist) {
      isWaveActive = false;
    }
  }
}

function mousePressed() {
  waveCenter = { x: mouseX, y: mouseY };
  isWaveActive = true;
  waveRadius = 0;
  
  // Trigger flash for squares within wave range
  let centerX = Math.floor(mouseX / squareSize);
  let centerY = Math.floor(mouseY / squareSize);
  
  for (let y = 0; y < gridSizeY; y++) {
    for (let x = 0; x < gridSizeX; x++) {
      let distToCenter = dist(x * squareSize, y * squareSize, mouseX, mouseY);
      
      if (distToCenter <= waveRadius + squareSize) {
        grid[y][x].isFlashing = true;
        grid[y][x].flashColor = color(random(360), 100, 100);
      }
    }
  }
}
