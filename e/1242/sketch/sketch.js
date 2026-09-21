function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();
}

function draw() {
  // Sky gradient from deep blue at top to lighter blue at bottom
  for (let y = 0; y < height; y++) {
    let t = map(y, 0, height, 0, 1);
    let skyColor = lerpColor(color(20, 40, 100), color(100, 150, 220), t);
    stroke(skyColor);
    line(0, y, width, y);
  }

  // Distant mountains with atmospheric haze
  fill(60, 80, 100);
  noStroke();
  beginShape();
  vertex(0, height * 0.7);
  for (let x = 0; x < width; x += 20) {
    let h = height * 0.7 + random(-30, 30);
    vertex(x, h);
  }
  vertex(width, height * 0.7);
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);

  // Rolling green fields
  fill(30, 120, 40);
  noStroke();
  beginShape();
  vertex(0, height * 0.7);
  for (let x = 0; x < width; x += 15) {
    let h = height * 0.7 + sin(x * 0.02) * 40;
    vertex(x, h);
  }
  vertex(width, height * 0.7);
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);

  // Sun
  fill(255, 255, 180);
  noStroke();
  ellipse(width * 0.8, height * 0.2, 100, 100);

  // Cast shadows
  strokeWeight(3);
  for (let i = 0; i < 50; i++) {
    let x = random(width);
    let y = random(height * 0.7, height);
    let len = random(20, 60);
    let angle = PI + random(-0.2, 0.2); // Slight deviation from vertical
    stroke(0, 0, 0, 80);
    line(x, y, x + cos(angle) * len, y + sin(angle) * len);
  }

  // Texture patches in foreground
  for (let i = 0; i < 200; i++) {
    let x = random(width);
    let y = random(height * 0.7, height);
    let s = random(1, 5);
    fill(random(30, 60), random(100, 150), random(40, 80));
    noStroke();
    ellipse(x, y, s, s);
  }
}
