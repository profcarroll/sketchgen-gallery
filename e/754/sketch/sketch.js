let cracks = [];
let dustDevils = [];
let skyColor;
let groundColor;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB);

  // Sky colors: pale and soft
  skyColor = color(240, 230, 220);

  // Ground colors: terracotta and reddish-brown
  groundColor = color(150, 60, 30);

  // Create cracks
  for (let i = 0; i < 1000; i++) {
    let x = random(width);
    let y = random(height * 0.7, height);
    let len = random(20, 80);
    let angle = random(TWO_PI);
    cracks.push({x, y, len, angle});
  }

  // Create dust devils
  for (let i = 0; i < 15; i++) {
    dustDevils.push({
      x: random(width),
      y: height * 0.7,
      size: random(10, 30),
      speed: random(0.5, 1.5),
      angle: random(TWO_PI)
    });
  }
}

function draw() {
  background(skyColor);

  // Draw ground
  fill(groundColor);
  noStroke();
  rect(0, height * 0.7, width, height * 0.3);

  // Draw cracks
  stroke(100, 40, 20);
  strokeWeight(2);
  for (let c of cracks) {
    push();
    translate(c.x, c.y);
    rotate(c.angle);
    line(0, 0, c.len, 0);
    pop();
  }

  // Draw dust devils
  noStroke();
  for (let d of dustDevils) {
    fill(200, 180, 160, 150);
    ellipse(d.x, d.y, d.size);
    d.x += cos(d.angle) * d.speed;
    d.y += sin(d.angle) * d.speed;
    if (d.x < 0 || d.x > width || d.y < 0 || d.y > height) {
      d.x = random(width);
      d.y = height * 0.7;
    }
  }

  // Draw distant rock formation
  fill(120, 50, 30);
  noStroke();
  beginShape();
  vertex(0, height * 0.7);
  for (let i = 0; i < width; i += 20) {
    let h = map(noise(i * 0.01), 0, 1, 0, 60);
    vertex(i, height * 0.7 - h);
  }
  vertex(width, height * 0.7);
  endShape(CLOSE);

  // Add atmospheric haze
  for (let i = 0; i < 20; i++) {
    let alpha = map(i, 0, 20, 10, 0);
    fill(240, 230, 220, alpha);
    rect(0, height * 0.7 + i * 5, width, 5);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
