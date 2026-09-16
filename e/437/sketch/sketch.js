let ships = [];
let trails = [];

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);

  for (let i = 0; i < 5; i++) {
    ships.push({
      x: random(width),
      y: random(height),
      angle: random(TWO_PI),
      speed: random(0.2, 0.8),
      size: random(30, 60),
      decay: random(0.99, 0.999),
      hue: random(20, 40),
      saturation: random(30, 50),
      brightness: random(40, 70),
      segments: [],
      trail: []
    });
  }
}

function draw() {
  background(220, 10, 95);

  for (let i = ships.length - 1; i >= 0; i--) {
    let ship = ships[i];

    // Update ship position
    ship.x += cos(ship.angle) * ship.speed;
    ship.y += sin(ship.angle) * ship.speed;

    // Apply decay to ship
    ship.size *= ship.decay;
    ship.hue += 0.1;

    // Wrap around screen
    if (ship.x < -50) ship.x = width + 50;
    if (ship.x > width + 50) ship.x = -50;
    if (ship.y < -50) ship.y = height + 50;
    if (ship.y > height + 50) ship.y = -50;

    // Add to trail
    ship.trail.push({x: ship.x, y: ship.y, life: 1});
    if (ship.trail.length > 20) {
      ship.trail.shift();
    }

    // Draw trail
    noFill();
    stroke(220, 50, 80, 0.3);
    strokeWeight(1);
    beginShape();
    for (let j = 0; j < ship.trail.length; j++) {
      let t = ship.trail[j];
      vertex(t.x, t.y);
    }
    endShape();

    // Draw ship
    push();
    translate(ship.x, ship.y);
    rotate(ship.angle);

    // Ship body with decay effect
    fill(ship.hue, ship.saturation, ship.brightness, 0.8);
    noStroke();
    beginShape();
    vertex(0, -ship.size/2);
    vertex(ship.size/3, ship.size/3);
    vertex(-ship.size/3, ship.size/3);
    endShape(CLOSE);

    // Decay details
    stroke(0, 0, 0, 0.2);
    strokeWeight(1);
    line(-ship.size/4, -ship.size/4, ship.size/4, ship.size/4);
    line(ship.size/4, -ship.size/4, -ship.size/4, ship.size/4);

    // Moss and barnacles
    fill(30, 50, 20, 0.6);
    ellipse(-ship.size/6, -ship.size/6, ship.size/8, ship.size/8);
    ellipse(ship.size/6, ship.size/6, ship.size/10, ship.size/10);

    pop();
  }

  // Update trails
  for (let i = trails.length - 1; i >= 0; i--) {
    let t = trails[i];
    t.life -= 0.01;
    if (t.life <= 0) {
      trails.splice(i, 1);
    }
  }

  // Add new trail particles occasionally
  if (random() < 0.3) {
    trails.push({
      x: random(width),
      y: random(height),
      life: 1,
      size: random(2, 5)
    });
  }

  // Draw trail particles
  noStroke();
  for (let t of trails) {
    fill(220, 30, 80, t.life * 0.4);
    ellipse(t.x, t.y, t.size);
  }
}
