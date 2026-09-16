let ships = [];
let wakes = [];
let texture;

function setup() {
  createCanvas(600, 400);
  texture = createGraphics(width, height);
  texture.background(220);
  for (let i = 0; i < 15; i++) {
    ships.push({
      x: random(width),
      y: random(height),
      size: random(20, 40),
      speed: random(0.5, 1.5),
      angle: random(TWO_PI),
      age: random(100, 300),
      color: color(random(100, 255), random(50, 150), random(100, 200)),
      tears: [],
      patina: []
    });
  }
}

function draw() {
  background(180, 200, 220);
  // Draw textured water
  image(texture, 0, 0);

  for (let i = ships.length - 1; i >= 0; i--) {
    let ship = ships[i];
    ship.x += cos(ship.angle) * ship.speed;
    ship.y += sin(ship.angle) * ship.speed;

    // Update age and remove if too old
    ship.age -= 0.5;
    if (ship.age < 0) {
      ships.splice(i, 1);
      continue;
    }

    // Add new wake point
    wakes.push({
      x: ship.x,
      y: ship.y,
      life: 200,
      color: color(150, 170, 190, 100)
    });

    // Draw ship with wear effects
    push();
    translate(ship.x, ship.y);
    rotate(ship.angle);

    noStroke();
    fill(ship.color);
    rectMode(CENTER);
    rect(0, 0, ship.size, ship.size * 0.6);

    // Add tears
    stroke(100);
    strokeWeight(1);
    for (let j = 0; j < 3; j++) {
      if (random() > 0.7) {
        let x = random(-ship.size/2, ship.size/2);
        let y = random(-ship.size/4, ship.size/4);
        line(x, y, x + random(-5, 5), y + random(-5, 5));
      }
    }

    // Add patina
    fill(100, 120, 140, 60);
    for (let j = 0; j < 3; j++) {
      let x = random(-ship.size/2, ship.size/2);
      let y = random(-ship.size/4, ship.size/4);
      ellipse(x, y, random(3, 8), random(3, 8));
    }

    pop();

    // Remove old wake points
    for (let j = wakes.length - 1; j >= 0; j--) {
      let wake = wakes[j];
      wake.life--;
      if (wake.life <= 0) {
        wakes.splice(j, 1);
      }
    }
  }

  // Draw wakes
  for (let wake of wakes) {
    fill(wake.color);
    noStroke();
    ellipse(wake.x, wake.y, 3, 3);
  }

  // Add some new ships occasionally
  if (random() > 0.98) {
    ships.push({
      x: random(width),
      y: random(height),
      size: random(20, 40),
      speed: random(0.5, 1.5),
      angle: random(TWO_PI),
      age: random(100, 300),
      color: color(random(100, 255), random(50, 150), random(100, 200)),
      tears: [],
      patina: []
    });
  }
}
