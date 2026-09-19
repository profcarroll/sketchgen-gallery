function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noLoop();
}

function draw() {
  // Sky background
  background(200, 80, 90);

  // Distant mountains
  fill(180, 40, 50);
  noStroke();
  beginShape();
  vertex(0, height * 0.7);
  for (let x = 0; x < width; x += 20) {
    let y = height * 0.7 + sin(x / 100) * 30;
    vertex(x, y);
  }
  vertex(width, height * 0.7);
  endShape(CLOSE);

  // Midground hills
  fill(120, 60, 60);
  noStroke();
  beginShape();
  vertex(0, height * 0.6);
  for (let x = 0; x < width; x += 15) {
    let y = height * 0.6 + sin(x / 80) * 40;
    vertex(x, y);
  }
  vertex(width, height * 0.6);
  endShape(CLOSE);

  // Foreground fields with varying saturation and texture
  for (let x = 0; x < width; x += 10) {
    for (let y = height * 0.5; y < height; y += 10) {
      let hue = map(sin(x / 50 + y / 30), -1, 1, 80, 120);
      let sat = map(noise(x * 0.01, y * 0.01), 0, 1, 60, 90);
      fill(hue, sat, 70);
      rect(x, y, 10, 10);
    }
  }

  // Elongated shadows
  noStroke();
  for (let x = 0; x < width; x += 30) {
    let shadowLength = map(noise(x * 0.02), 0, 1, 200, 500);
    fill(0, 0, 0, 0.3);
    beginShape();
    vertex(x, height * 0.5);
    vertex(x + shadowLength, height * 0.5);
    vertex(x + shadowLength, height);
    vertex(x, height);
    endShape(CLOSE);
  }

  // Soft clouds
  fill(360, 0, 100, 0.7);
  noStroke();
  for (let i = 0; i < 20; i++) {
    let cx = map(i, 0, 20, 0, width);
    let cy = height * 0.2 + sin(i) * 30;
    ellipse(cx, cy, 80, 40);
  }

  // Sun
  fill(60, 100, 100);
  noStroke();
  ellipse(width * 0.8, height * 0.15, 80, 80);
}
