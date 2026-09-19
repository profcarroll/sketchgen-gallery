function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();
}

function draw() {
  // Background gradient for sky
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(255, 140, 0), color(0, 0, 100), inter); // Sunset to night
    stroke(c);
    line(0, y, width, y);
  }

  // Distant mountains with atmospheric mist
  fill(50, 60, 40);
  noStroke();
  beginShape();
  for (let x = 0; x < width; x += 10) {
    let y = height * 0.7 + sin(x * 0.01) * 30;
    vertex(x, y);
  }
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);

  // Midground hills
  fill(30, 80, 20);
  noStroke();
  beginShape();
  for (let x = 0; x < width; x += 15) {
    let y = height * 0.6 + sin(x * 0.02) * 50;
    vertex(x, y);
  }
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);

  // Foreground grass texture
  stroke(20, 100, 30);
  strokeWeight(1);
  for (let i = 0; i < 5000; i++) {
    let x = random(width);
    let y = random(height * 0.6);
    let len = random(3, 8);
    line(x, y, x, y + len);
  }

  // Shadows in foreground
  noStroke();
  fill(10, 50, 10, 150);
  beginShape();
  for (let x = 0; x < width; x += 10) {
    let y = height * 0.6 + sin(x * 0.02 + millis() * 0.001) * 30;
    vertex(x, y);
  }
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
