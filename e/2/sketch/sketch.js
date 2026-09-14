let squares = [];
let wave;
let pulseOffset = 0;

function setup() {
  createCanvas(400, 400);
  colorMode(HSB, 360, 100, 100, 1);
  background(20);

  let gridSize = 20;
  let squareSize = 15;

  for (let y = 0; y < height; y += gridSize) {
    for (let x = 0; x < width; x += gridSize) {
      squares.push({
        x: x + squareSize / 2,
        y: y + squareSize / 2,
        size: squareSize,
        pulse: random(100),
        active: false,
        flash: 0
      });
    }
  }

  wave = {
    x: width / 2,
    y: height / 2,
    radius: 0,
    maxRadius: max(width, height) * 1.5,
    speed: 3,
    active: false
  };
}

function draw() {
  background(20);

  // Update pulse offset for breathing effect
  pulseOffset += 0.02;

  // Draw squares
  for (let square of squares) {
    let pulse = sin(pulseOffset + square.pulse) * 0.5 + 0.5;
    let brightness = 10 + pulse * 20;
    let hue = 30; // Warm orange hue
    fill(hue, 60, brightness, 1);
    noStroke();
    rect(square.x - square.size / 2, square.y - square.size / 2, square.size, square.size, 3);
  }

  // Draw wave if active
  if (wave.active) {
    stroke(255, 0.8);
    noFill();
    ellipse(wave.x, wave.y, wave.radius * 2);
    wave.radius += wave.speed;
    if (wave.radius > wave.maxRadius) {
      wave.active = false;
    }
  }
}

function mousePressed() {
  wave.active = true;
  wave.x = mouseX;
  wave.y = mouseY;
  wave.radius = 0;

  // Activate squares near the click
  for (let square of squares) {
    let d = dist(mouseX, mouseY, square.x, square.y);
    if (d < 100) {
      square.active = true;
      square.flash = map(d, 0, 100, 1, 0);
    }
  }
}

function mouseReleased() {
  // Reset square states
  for (let square of squares) {
    square.active = false;
    square.flash = 0;
  }
}
