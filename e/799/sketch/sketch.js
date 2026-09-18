let ships = [];
let crystals = [];

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);

  // Create ships with aged appearance
  for (let i = 0; i < 12; i++) {
    ships.push({
      x: random(100, width - 100),
      y: random(150, height - 150),
      size: random(40, 80),
      age: random(100),
      patina: random(0.3, 0.7),
      moss: random(0.2, 0.6)
    });
  }

  // Create crystalline structures
  for (let i = 0; i < 50; i++) {
    crystals.push({
      x: random(width),
      y: random(height),
      size: random(2, 8),
      angle: random(TWO_PI),
      speed: random(0.001, 0.005)
    });
  }
}

function draw() {
  // Translucent background
  background(0, 0, 95, 0.7);

  // Draw mineral streaks
  stroke(0, 0, 80, 0.2);
  strokeWeight(1);
  for (let i = 0; i < 30; i++) {
    let x1 = random(width);
    let y1 = random(height);
    let x2 = x1 + random(-50, 50);
    let y2 = y1 + random(-50, 50);
    line(x1, y1, x2, y2);
  }

  // Draw salt deposits
  noStroke();
  fill(30, 10, 95, 0.4);
  for (let i = 0; i < 100; i++) {
    let x = random(width);
    let y = random(height);
    let s = random(2, 6);
    ellipse(x, y, s, s);
  }

  // Draw ships
  for (let ship of ships) {
    drawShip(ship);
  }

  // Animate crystals
  for (let crystal of crystals) {
    crystal.angle += crystal.speed;
    let x = crystal.x + cos(crystal.angle) * 5;
    let y = crystal.y + sin(crystal.angle) * 5;

    stroke(200, 30, 90, 0.7);
    strokeWeight(1);
    noFill();
    push();
    translate(x, y);
    rotate(crystal.angle);
    for (let i = 0; i < 6; i++) {
      rotate(TWO_PI / 6);
      line(0, 0, crystal.size * 2, 0);
    }
    pop();
  }

  // Prevent motion
  noLoop();
}

function drawShip(ship) {
  push();
  translate(ship.x, ship.y);

  // Base hull with aged texture
  fill(30, 10, 40, 0.8);
  stroke(20, 5, 20, 0.9);
  strokeWeight(1);

  // Ship shape with paper-cut style
  beginShape();
  vertex(-ship.size * 0.6, -ship.size * 0.3);
  vertex(ship.size * 0.4, -ship.size * 0.2);
  vertex(ship.size * 0.7, ship.size * 0.1);
  vertex(ship.size * 0.5, ship.size * 0.4);
  vertex(-ship.size * 0.3, ship.size * 0.3);
  endShape(CLOSE);

  // Patina overlay
  fill(20, 5, 20, ship.patina);
  noStroke();
  beginShape();
  vertex(-ship.size * 0.6, -ship.size * 0.3);
  vertex(ship.size * 0.4, -ship.size * 0.2);
  vertex(ship.size * 0.7, ship.size * 0.1);
  vertex(ship.size * 0.5, ship.size * 0.4);
  vertex(-ship.size * 0.3, ship.size * 0.3);
  endShape(CLOSE);

  // Moss patches
  fill(80, 50, 20, ship.moss);
  ellipse(ship.size * 0.2, -ship.size * 0.1, ship.size * 0.4, ship.size * 0.2);
  ellipse(-ship.size * 0.3, ship.size * 0.2, ship.size * 0.3, ship.size * 0.15);

  // Water damage
  stroke(0, 0, 0, 0.3);
  strokeWeight(1);
  for (let i = 0; i < 5; i++) {
    let x1 = random(-ship.size * 0.5, ship.size * 0.5);
    let y1 = random(-ship.size * 0.3, ship.size * 0.3);
    let x2 = x1 + random(-20, 20);
    let y2 = y1 + random(-20, 20);
    line(x1, y1, x2, y2);
  }

  pop();
}
