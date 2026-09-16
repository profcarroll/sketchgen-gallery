function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
}

function draw() {
  // Smoothly shifting background gradient
  let time = millis() * 0.0002;
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let hue = (240 + sin(time + inter) * 30) % 360;
    stroke(hue, 80, 90, 1);
    line(0, y, width, y);
  }

  // Dynamic grid with flowing lines
  let gridSize = 40;
  let timeOffset = millis() * 0.0005;

  for (let x = 0; x < width; x += gridSize) {
    let offset = sin(x * 0.02 + timeOffset) * 10;
    let yStep = gridSize + offset;
    for (let y = 0; y < height; y += yStep) {
      // Draw lines with subtle variation
      let lineLength = 15 + sin(y * 0.03 + timeOffset) * 5;
      stroke(200, 60, 80, 0.7);
      line(x, y, x, y + lineLength);
    }
  }

  // Overlay a second grid at a different angle
  let angle = time * 0.3;
  let sinA = sin(angle);
  let cosA = cos(angle);

  for (let i = 0; i < width; i += gridSize) {
    let x1 = i;
    let y1 = 0;
    let x2 = i;
    let y2 = height;

    // Rotate the line
    let cx = width / 2;
    let cy = height / 2;
    let rx1 = (x1 - cx) * cosA - (y1 - cy) * sinA + cx;
    let ry1 = (x1 - cx) * sinA + (y1 - cy) * cosA + cy;
    let rx2 = (x2 - cx) * cosA - (y2 - cy) * sinA + cx;
    let ry2 = (x2 - cx) * sinA + (y2 - cy) * cosA + cy;

    stroke(180, 50, 90, 0.6);
    line(rx1, ry1, rx2, ry2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
