let gridSize = 20;
let gridWidth, gridHeight;
let squares = [];

function setup() {
  createCanvas(600, 600);
  gridWidth = width / gridSize;
  gridHeight = height / gridSize;

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      squares.push({
        x: x * gridWidth,
        y: y * gridHeight,
        size: gridWidth * 0.8,
        baseSize: gridWidth * 0.8,
        timeOffset: (x + y) * 0.1,
        pulseSpeed: map(x, 0, gridSize, 0.5, 2.0)
      });
    }
  }
}

function draw() {
  background(240);
  
  for (let square of squares) {
    let time = millis() / 1000;
    let pulse = sin(time * square.pulseSpeed + square.timeOffset) * 0.5 + 0.5;
    let newSize = square.baseSize * (0.9 + pulse * 0.2);
    
    fill(255);
    stroke(200);
    rect(square.x, square.y, newSize, newSize, 4);
  }
}
