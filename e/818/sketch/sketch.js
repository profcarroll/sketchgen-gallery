function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();
}

function draw() {
  // Sky gradient
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(255, 255, 255), color(135, 206, 235), inter);
    stroke(c);
    line(0, y, width, y);
  }

  // Distant mountains (hazy)
  fill(80, 100, 80);
  noStroke();
  beginShape();
  vertex(0, height);
  for (let x = 0; x < width; x += 20) {
    let y = height - 150 + sin(x / 100) * 30 + random(-10, 10);
    vertex(x, y);
  }
  vertex(width, height);
  endShape(CLOSE);

  // Midground hills
  fill(40, 120, 40);
  beginShape();
  vertex(0, height);
  for (let x = 0; x < width; x += 15) {
    let y = height - 100 + sin(x / 80) * 50 + random(-15, 15);
    vertex(x, y);
  }
  vertex(width, height);
  endShape(CLOSE);

  // Foreground grass
  stroke(30, 90, 30);
  strokeWeight(1);
  for (let i = 0; i < 1000; i++) {
    let x = random(width);
    let y = height - 50 + random(-20, 20);
    let len = random(10, 30);
    line(x, y, x, y - len);
  }

  // Clouds
  fill(255, 255, 255, 180);
  noStroke();
  for (let i = 0; i < 15; i++) {
    let x = random(width);
    let y = random(height / 3);
    ellipse(x, y, 60, 20);
    ellipse(x + 20, y - 10, 40, 15);
    ellipse(x + 40, y, 50, 20);
  }

  // Sun
  fill(255, 255, 0);
  noStroke();
  ellipse(width - 100, 100, 80, 80);

  // Sun rays
  stroke(255, 255, 0, 150);
  strokeWeight(3);
  for (let i = 0; i < 12; i++) {
    let angle = (i / 12) * TWO_PI;
    let x1 = width - 100 + cos(angle) * 40;
    let y1 = 100 + sin(angle) * 40;
    let x2 = width - 100 + cos(angle) * 70;
    let y2 = 100 + sin(angle) * 70;
    line(x1, y1, x2, y2);
  }
}
