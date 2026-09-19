function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noLoop();
}

function draw() {
  // Background gradient for sky
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let b = map(inter, 0, 1, 85, 20); // Warm orange to cool blue
    stroke(30, 90, b);
    line(0, y, width, y);
  }

  // Distant mountains with atmospheric mist
  fill(240, 30, 20); // Cool blue
  noStroke();
  beginShape();
  vertex(0, height * 0.6);
  for (let x = 0; x < width; x += 20) {
    let y = height * 0.6 + sin(x / 100) * 30;
    vertex(x, y);
  }
  vertex(width, height * 0.6);
  endShape(CLOSE);

  // Foreground rolling fields
  for (let y = height * 0.6; y < height; y += 20) {
    let offset = sin(y / 100) * 50;
    for (let x = 0; x < width; x += 10) {
      let noiseVal = noise(x * 0.01, y * 0.01);
      let greenHue = map(noiseVal, 0, 1, 80, 120); // Varying greens
      fill(greenHue, 70, 60);
      rect(x + offset, y, 10, 20);
    }
  }

  // Dramatic shadows
  for (let y = height * 0.6; y < height; y += 30) {
    let offset = sin(y / 100) * 50;
    for (let x = 0; x < width; x += 20) {
      if (x % 40 === 0) continue; // Skip some to create shadow pattern
      let noiseVal = noise(x * 0.01, y * 0.01);
      let shadowStrength = map(noiseVal, 0, 1, 0.2, 0.7);
      fill(0, 0, 0, shadowStrength);
      rect(x + offset, y, 20, 30);
    }
  }

  // Sun at horizon
  fill(30, 100, 100); // Bright orange
  noStroke();
  ellipse(width * 0.5, height * 0.6, 80, 80);

  // Sun rays
  strokeWeight(2);
  stroke(30, 100, 100, 0.5);
  for (let i = 0; i < 12; i++) {
    let angle = map(i, 0, 12, 0, TWO_PI);
    let x1 = width * 0.5 + cos(angle) * 40;
    let y1 = height * 0.6 + sin(angle) * 40;
    let x2 = width * 0.5 + cos(angle) * 70;
    let y2 = height * 0.6 + sin(angle) * 70;
    line(x1, y1, x2, y2);
  }
}
