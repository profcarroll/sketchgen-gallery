function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();
}

function draw() {
  // Sky gradient from light blue at top to pale yellow at horizon
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(135, 206, 235), color(255, 255, 224), inter);
    stroke(c);
    line(0, y, width, y);
  }

  // Distant mountains
  fill(100, 120, 100);
  noStroke();
  beginShape();
  vertex(0, height * 0.7);
  for (let x = 0; x < width; x += 20) {
    let y = height * 0.7 + random(-30, 30);
    vertex(x, y);
  }
  vertex(width, height * 0.7);
  endShape(CLOSE);

  // Midground hills
  fill(80, 150, 80);
  beginShape();
  vertex(0, height * 0.6);
  for (let x = 0; x < width; x += 10) {
    let y = height * 0.6 + noise(x * 0.01) * 50;
    vertex(x, y);
  }
  vertex(width, height * 0.6);
  endShape(CLOSE);

  // Foreground grass patches
  for (let i = 0; i < 2000; i++) {
    let x = random(width);
    let y = random(height * 0.4, height * 0.65);
    let sz = random(1, 3);
    let c = color(50 + random(50), 120 + random(80), 50 + random(50));
    fill(c);
    noStroke();
    ellipse(x, y, sz, sz * 2);
  }

  // Shadows - exaggerated for depth
  stroke(0, 30);
  strokeWeight(1);
  for (let i = 0; i < 1000; i++) {
    let x = random(width);
    let y = random(height * 0.4, height * 0.65);
    let len = random(20, 50);
    let angle = PI / 3 + random(-PI / 6, PI / 6); // Sun at 60 degrees
    line(x, y, x + cos(angle) * len, y + sin(angle) * len);
  }

  // Sun
  fill(255, 255, 200);
  noStroke();
  ellipse(width * 0.8, height * 0.15, 60, 60);
}
