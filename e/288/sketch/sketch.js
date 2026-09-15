let ships = [];
let wakes = [];

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create initial ships
  for (let i = 0; i < 15; i++) {
    ships.push({
      x: random(width),
      y: random(height / 2, height),
      speed: random(0.5, 2),
      size: random(30, 60),
      angle: random(TWO_PI),
      trail: []
    });
  }
}

function draw() {
  background(200, 10, 90); // Sky blue background

  // Draw water surface
  noStroke();
  fill(180, 30, 60);
  rect(0, height / 2, width, height / 2);

  // Update and draw ships
  for (let i = ships.length - 1; i >= 0; i--) {
    let ship = ships[i];
    
    // Move ship
    ship.x += cos(ship.angle) * ship.speed;
    ship.y += sin(ship.angle) * ship.speed;
    
    // Add to trail
    ship.trail.push({x: ship.x, y: ship.y});
    if (ship.trail.length > 20) {
      ship.trail.shift();
    }
    
    // Draw wake
    drawWake(ship);
    
    // Draw ship body with wood texture
    drawShip(ship);
    
    // Remove ships that go off screen
    if (ship.x < -100 || ship.x > width + 100 || ship.y < -100 || ship.y > height + 100) {
      ships.splice(i, 1);
    }
  }

  // Add new ships occasionally
  if (random() < 0.02) {
    ships.push({
      x: random(width),
      y: random(height / 2, height),
      speed: random(0.5, 2),
      size: random(30, 60),
      angle: random(TWO_PI),
      trail: []
    });
  }
}

function drawShip(ship) {
  push();
  translate(ship.x, ship.y);
  rotate(ship.angle);
  
  // Ship hull (wood texture)
  fill(20, 50, 40);
  stroke(10, 30, 20);
  strokeWeight(1);
  beginShape();
  vertex(-ship.size * 0.7, -ship.size * 0.2);
  vertex(ship.size * 0.8, -ship.size * 0.2);
  vertex(ship.size * 0.9, ship.size * 0.1);
  vertex(0, ship.size * 0.4);
  vertex(-ship.size * 0.6, ship.size * 0.1);
  endShape(CLOSE);
  
  // Deck details
  fill(30, 40, 50);
  strokeWeight(0.5);
  rectMode(CENTER);
  rect(0, -ship.size * 0.1, ship.size * 0.8, ship.size * 0.2);
  
  // Mast and sail
  stroke(0, 0, 70);
  strokeWeight(1);
  line(0, -ship.size * 0.4, 0, ship.size * 0.3);
  
  fill(250, 90, 90);
  noStroke();
  beginShape();
  vertex(0, -ship.size * 0.4);
  vertex(-ship.size * 0.6, -ship.size * 0.1);
  vertex(ship.size * 0.6, -ship.size * 0.1);
  endShape(CLOSE);
  
  pop();
}

function drawWake(ship) {
  noFill();
  strokeWeight(1);
  
  for (let i = 0; i < ship.trail.length - 1; i++) {
    let p1 = ship.trail[i];
    let p2 = ship.trail[i + 1];
    
    // Fade the wake
    let alpha = map(i, 0, ship.trail.length, 0, 100);
    
    if (alpha > 0) {
      stroke(180, 20, 70, alpha / 100);
      line(p1.x, p1.y, p2.x, p2.y);
    }
  }
}
