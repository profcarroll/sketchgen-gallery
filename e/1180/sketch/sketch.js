function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noLoop();
}

function draw() {
  // Sky background
  background(210, 80, 95);

  // Distant mountains (haze effect)
  fill(180, 30, 40);
  noStroke();
  beginShape();
  vertex(0, height * 0.6);
  for (let x = 0; x < width; x += 20) {
    let y = height * 0.6 + sin(x / 100) * 30 + random(-5, 5);
    vertex(x, y);
  }
  vertex(width, height * 0.6);
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);

  // Midground hills
  fill(120, 50, 60);
  beginShape();
  vertex(0, height * 0.7);
  for (let x = 0; x < width; x += 15) {
    let y = height * 0.7 + sin(x / 80) * 40 + random(-10, 10);
    vertex(x, y);
  }
  vertex(width, height * 0.7);
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);

  // Foreground grass patches
  for (let i = 0; i < 50; i++) {
    let x = random(width);
    let y = height * 0.8 + random(-20, 20);
    let size = random(30, 100);
    fill(100, 70, 60 + random(20));
    noStroke();
    ellipse(x, y, size, size * 0.5);
  }

  // Detailed foreground fields
  for (let i = 0; i < 100; i++) {
    let x = random(width);
    let y = height * 0.8 + random(-10, 10);
    let sz = random(20, 50);
    fill(90, 80, 60 + random(10));
    noStroke();
    ellipse(x, y, sz, sz * 0.3);
  }

  // Sun
  fill(40, 100, 100);
  noStroke();
  ellipse(width * 0.8, height * 0.2, 80, 80);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
