function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noLoop();
}

function draw() {
  // Create a smooth gradient background
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(220, 30, 10), color(180, 20, 5), inter);
    stroke(c);
    line(0, y, width, y);
  }

  // Draw grid lines
  stroke(0, 0, 90);
  strokeWeight(1);

  let gridSize = 40;
  for (let x = 0; x < width; x += gridSize) {
    line(x, 0, x, height);
  }
  for (let y = 0; y < height; y += gridSize) {
    line(0, y, width, y);
  }

  // Draw intersections with subtle color variation
  noStroke();
  for (let x = 0; x < width; x += gridSize) {
    for (let y = 0; y < height; y += gridSize) {
      fill((x + y) % 120, 20, 80);
      ellipse(x, y, 4, 4);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
