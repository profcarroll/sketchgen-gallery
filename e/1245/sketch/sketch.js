let squares = [];
const gridSize = 20;
const squareSize = 20;
const pulseSpeed = 0.02;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Create a grid of squares
  for (let x = 0; x < width; x += gridSize) {
    for (let y = 0; y < height; y += gridSize) {
      squares.push({ x, y });
    }
  }
}

function draw() {
  background(10, 10, 20);
  
  // Calculate pulse effect
  const pulse = sin(frameCount * pulseSpeed);
  const opacity = map(pulse, -1, 1, 50, 200);
  
  // Draw all squares with synchronized opacity
  for (let square of squares) {
    fill(255, 255, 255, opacity);
    rect(square.x, square.y, squareSize, squareSize);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
