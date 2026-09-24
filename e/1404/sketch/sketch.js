let squares = [];
let waveRadius = 0;
let waveSpeed = 2;
let waveActive = false;
let centerX, centerY;

function setup() {
  createCanvas(windowWidth, windowHeight);
  centerX = width / 2;
  centerY = height / 2;

  // Create a grid of squares
  const gridSize = 20;
  const squareSize = 15;
  for (let y = 0; y < height; y += gridSize) {
    for (let x = 0; x < width; x += gridSize) {
      squares.push({
        x: x,
        y: y,
        size: squareSize,
        pulseOffset: random(TWO_PI),
        pulseSpeed: random(0.02, 0.05),
        originalColor: color(20, 10, 5), // Deep near-black with warm hue
        isAffected: false,
        affectTime: 0
      });
    }
  }
}

function draw() {
  background(20, 10, 5); // Near-black background with warm tint

  // Update and display squares
  for (let square of squares) {
    // Pulsing effect
    let pulse = sin(frameCount * square.pulseSpeed + square.pulseOffset) * 0.5 + 0.5;
    let size = square.size + pulse * 3;

    // Check if square is affected by wave
    let d = dist(square.x, square.y, centerX, centerY);
    if (waveActive && d < waveRadius) {
      square.isAffected = true;
      square.affectTime = frameCount;
    }

    // Flash effect when affected
    if (square.isAffected) {
      let flash = 255 - (frameCount - square.affectTime) * 10;
      if (flash < 0) {
        square.isAffected = false;
        fill(square.originalColor);
      } else {
        fill(flash, 100, 50); // Bright yellow-orange flash
      }
    } else {
      fill(square.originalColor);
    }

    noStroke();
    rect(square.x - size/2, square.y - size/2, size, size);
  }

  // Update wave
  if (waveActive) {
    waveRadius += waveSpeed;
    if (waveRadius > max(width, height)) {
      waveActive = false;
      waveRadius = 0;
    }
  }
}

function mousePressed() {
  // Start wave at mouse position
  waveActive = true;
  waveRadius = 0;
  centerX = mouseX;
  centerY = mouseY;
}
