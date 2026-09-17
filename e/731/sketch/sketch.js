let ships = [];
let saltStreaks = [];
let fragments = [];
let canvas;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);

  // Create ships
  for (let i = 0; i < 8; i++) {
    ships.push({
      x: random(width),
      y: random(height * 0.3),
      size: random(20, 50),
      speed: random(0.5, 1.5),
      angle: random(TWO_PI),
      opacity: random(0.6, 0.9),
      tear: random(3, 8),
      color: color(random(20, 40), random(30, 60), random(40, 70))
    });
  }

  // Create salt streaks
  for (let i = 0; i < 50; i++) {
    saltStreaks.push({
      x: random(width),
      y: -random(height),
      length: random(20, 80),
      speed: random(1, 3),
      opacity: random(0.2, 0.6)
    });
  }

  // Create fragments
  for (let i = 0; i < 200; i++) {
    fragments.push({
      x: random(width),
      y: height,
      size: random(1, 5),
      speed: random(0.5, 2),
      angle: random(TWO_PI),
      opacity: random(0.3, 0.7),
      color: color(random(20, 40), random(20, 50), random(30, 60))
    });
  }
}

function draw() {
  background(200, 10, 95, 0.1); // Translucent blue-green

  // Draw salt streaks
  for (let s of saltStreaks) {
    stroke(240, 20, 90, s.opacity);
    strokeWeight(1);
    line(s.x, s.y, s.x, s.y + s.length);
    s.y += s.speed;
    if (s.y > height + s.length) {
      s.y = -random(height);
      s.x = random(width);
    }
  }

  // Draw ships
  for (let ship of ships) {
    push();
    translate(ship.x, ship.y);
    rotate(ship.angle);

    // Ship body
    fill(ship.color);
    noStroke();
    beginShape();
    vertex(0, -ship.size/2);
    vertex(ship.size * 0.8, ship.size/4);
    vertex(-ship.size * 0.8, ship.size/4);
    endShape(CLOSE);

    // Age details
    fill(0, 0, 0, 0.1);
    for (let i = 0; i < ship.tear; i++) {
      let tx = random(-ship.size/2, ship.size/2);
      let ty = random(-ship.size/4, ship.size/4);
      ellipse(tx, ty, random(3, 8), random(1, 3));
    }

    // Barnacles
    fill(200, 30, 40);
    for (let i = 0; i < 5; i++) {
      let bx = random(-ship.size/2, ship.size/2);
      let by = random(ship.size/4 - 10, ship.size/4 + 10);
      ellipse(bx, by, random(3, 6), random(3, 6));
    }

    pop();

    // Move ship
    ship.x += cos(ship.angle) * ship.speed;
    ship.y += sin(ship.angle) * ship.speed;

    // Random angle changes
    ship.angle += random(-0.02, 0.02);

    if (ship.x > width + 100 || ship.x < -100 || ship.y > height + 100) {
      ship.x = random(width);
      ship.y = -50;
      ship.angle = random(TWO_PI);
    }
  }

  // Draw fragments
  for (let f of fragments) {
    fill(f.color, f.opacity);
    noStroke();
    ellipse(f.x, f.y, f.size);

    f.x += cos(f.angle) * f.speed;
    f.y -= f.speed;
    f.angle += random(-0.1, 0.1);

    if (f.y < 0 || f.y > height) {
      f.x = random(width);
      f.y = height;
      f.angle = random(TWO_PI);
    }
  }

  // Draw accumulating fragments at bottom
  for (let i = 0; i < 50; i++) {
    if (random() < 0.1) {
      let x = random(width);
      let y = height - random(20, 50);
      fill(200, 30, 40, 0.6);
      noStroke();
      ellipse(x, y, random(2, 8), random(2, 8));
    }
  }

  // Add a subtle shimmer effect
  stroke(240, 10, 90, 0.05);
  strokeWeight(1);
  for (let i = 0; i < 100; i++) {
    let x = random(width);
    let y = random(height);
    point(x, y);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
