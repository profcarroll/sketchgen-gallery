let rocks = [];
let snow = [];
let debris = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);

  // Create rocky formations
  for (let i = 0; i < 50; i++) {
    rocks.push({
      x: random(width),
      y: random(height * 0.4, height * 0.8),
      w: random(30, 100),
      h: random(20, 60),
      angle: random(TWO_PI),
      color: color(random(200, 240), 20, 30)
    });
  }

  // Create snow particles
  for (let i = 0; i < 1000; i++) {
    snow.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      speed: random(0.1, 0.5),
      opacity: random(0.3, 1)
    });
  }

  // Create debris streaks
  for (let i = 0; i < 200; i++) {
    debris.push({
      x: random(width),
      y: random(height * 0.4, height * 0.8),
      length: random(10, 50),
      angle: random(TWO_PI),
      color: color(random(30, 60), 80, 90),
      width: random(1, 3)
    });
  }
}

function draw() {
  background(220, 10, 90);

  // Draw snow
  noStroke();
  fill(240, 5, 95);
  for (let s of snow) {
    ellipse(s.x, s.y, s.size);
  }

  // Draw rocks
  for (let r of rocks) {
    push();
    translate(r.x, r.y);
    rotate(r.angle);
    fill(r.color);
    rectMode(CENTER);
    rect(0, 0, r.w, r.h, 5);
    pop();
  }

  // Draw debris streaks
  strokeWeight(2);
  for (let d of debris) {
    stroke(d.color);
    line(d.x, d.y, d.x + cos(d.angle) * d.length, d.y + sin(d.angle) * d.length);
  }

  noLoop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
