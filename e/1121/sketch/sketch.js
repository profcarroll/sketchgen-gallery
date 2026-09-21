let stalks = [];
let lightPattern;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);

  // Create corn stalks
  for (let i = 0; i < 200; i++) {
    stalks.push({
      x: random(width),
      y: random(height * 0.3, height * 0.7),
      z: random(-50, 50),
      h: random(80, 150),
      w: random(2, 6)
    });
  }

  // Create light pattern points
  lightPattern = [];
  for (let i = 0; i < 100; i++) {
    lightPattern.push({
      x: map(i, 0, 99, 0, width),
      y: height * 0.7,
      radius: random(20, 60)
    });
  }
}

function draw() {
  background(20, 50, 10);

  time += 0.02;

  // Draw corn stalks
  stroke(30, 80, 20);
  strokeWeight(2);
  noFill();
  for (let stalk of stalks) {
    push();
    translate(stalk.x, stalk.y, stalk.z);
    line(0, 0, 0, 0, -stalk.h, 0);
    pop();
  }

  // Draw light pattern
  noStroke();
  fill(0, 255, 255, 80);
  beginShape();
  for (let i = 0; i < lightPattern.length; i++) {
    let point = lightPattern[i];
    let offset = sin(time + i * 0.1) * 30;
    let y = point.y + offset;
    vertex(point.x, y);
  }
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
