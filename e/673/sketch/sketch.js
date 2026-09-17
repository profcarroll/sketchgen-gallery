let ships = [];
let fragments = [];
let saltParticles = [];

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create ships with aged appearance
  for (let i = 0; i < 5; i++) {
    ships.push({
      x: random(width),
      y: random(height),
      angle: random(TWO_PI),
      size: random(30, 60),
      speed: random(0.2, 0.5),
      saltTrail: []
    });
  }

  // Create fragments
  for (let i = 0; i < 50; i++) {
    fragments.push({
      x: random(width),
      y: random(height),
      size: random(3, 10),
      speed: random(0.1, 0.3),
      angle: random(TWO_PI)
    });
  }

  // Create salt particles
  for (let i = 0; i < 200; i++) {
    saltParticles.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      speed: random(0.05, 0.1)
    });
  }
}

function draw() {
  background(200, 10, 90, 0.8); // Translucent blue-gray background

  // Draw salt particles
  for (let p of saltParticles) {
    fill(30, 50, 100, 0.7);
    noStroke();
    ellipse(p.x, p.y, p.size);

    // Move particle slightly
    p.x += sin(frameCount * 0.02 + p.x * 0.01) * p.speed;
    p.y += cos(frameCount * 0.02 + p.y * 0.01) * p.speed;
  }

  // Draw ships
  for (let ship of ships) {
    push();
    translate(ship.x, ship.y);
    rotate(ship.angle);

    // Ship body with aged appearance
    fill(30, 20, 80, 0.9);
    stroke(30, 15, 60, 0.7);
    strokeWeight(1);
    beginShape();
    vertex(-ship.size * 0.8, -ship.size * 0.2);
    vertex(ship.size * 0.8, -ship.size * 0.2);
    vertex(ship.size * 0.6, ship.size * 0.3);
    vertex(-ship.size * 0.6, ship.size * 0.3);
    endShape(CLOSE);

    // Moss and patina details
    fill(100, 30, 20, 0.5);
    ellipse(-ship.size * 0.4, -ship.size * 0.1, ship.size * 0.3);
    ellipse(ship.size * 0.4, ship.size * 0.1, ship.size * 0.2);

    pop();

    // Move ship
    ship.x += cos(ship.angle) * ship.speed;
    ship.y += sin(ship.angle) * ship.speed;

    // Add to salt trail
    ship.saltTrail.push({x: ship.x, y: ship.y});
    if (ship.saltTrail.length > 30) {
      ship.saltTrail.shift();
    }

    // Draw salt trail
    noFill();
    stroke(30, 50, 100, 0.5);
    strokeWeight(1);
    beginShape();
    for (let pos of ship.saltTrail) {
      vertex(pos.x, pos.y);
    }
    endShape();

    // Occasionally detach a fragment
    if (frameCount % 100 === 0 && random() > 0.7) {
      fragments.push({
        x: ship.x,
        y: ship.y,
        size: random(3, 8),
        speed: random(0.1, 0.4),
        angle: random(TWO_PI)
      });
    }
  }

  // Draw fragments
  for (let f of fragments) {
    fill(30, 20, 70, 0.6);
    noStroke();
    ellipse(f.x, f.y, f.size);

    // Move fragment
    f.x += cos(f.angle) * f.speed;
    f.y += sin(f.angle) * f.speed;

    // Remove if off screen
    if (f.x < -20 || f.x > width + 20 || f.y < -20 || f.y > height + 20) {
      let i = fragments.indexOf(f);
      if (i > -1) fragments.splice(i, 1);
    }
  }

  // Slight animation to simulate ambient movement
  translate(0, sin(frameCount * 0.01) * 0.5);
}
