let ships = [];
let wakes = [];
let water;

function setup() {
  createCanvas(windowWidth, windowHeight);
  water = color(30, 144, 255);
  
  // Create ships with random properties
  for (let i = 0; i < 5; i++) {
    ships.push({
      x: random(width),
      y: random(height * 0.3, height * 0.7),
      size: random(30, 60),
      speed: random(0.5, 2),
      angle: random(TWO_PI),
      color: color(random(100, 180), random(60, 120), random(20, 60)),
      trail: []
    });
  }
}

function draw() {
  background(water);
  
  // Draw water surface
  noStroke();
  fill(30, 144, 255, 100);
  rect(0, height * 0.7, width, height * 0.3);
  
  // Update and draw ships
  for (let ship of ships) {
    // Move ship
    ship.x += cos(ship.angle) * ship.speed;
    ship.y += sin(ship.angle) * ship.speed;
    
    // Bounce off edges
    if (ship.x < 0 || ship.x > width) {
      ship.angle = PI - ship.angle;
    }
    if (ship.y < 0 || ship.y > height) {
      ship.angle = -ship.angle;
    }
    
    // Add to trail
    ship.trail.push({x: ship.x, y: ship.y});
    if (ship.trail.length > 20) {
      ship.trail.shift();
    }
    
    // Draw wake
    drawWake(ship);
    
    // Draw ship
    push();
    translate(ship.x, ship.y);
    rotate(ship.angle);
    drawShip(ship);
    pop();
  }
}

function drawShip(ship) {
  // Ship hull (wooden texture)
  fill(ship.color);
  noStroke();
  ellipse(0, 0, ship.size, ship.size * 0.6);
  
  // Ship deck
  fill(120, 80, 40);
  rect(-ship.size * 0.4, -ship.size * 0.3, ship.size * 0.8, ship.size * 0.2);
  
  // Mast and sail
  stroke(100);
  strokeWeight(2);
  line(0, -ship.size * 0.4, 0, -ship.size * 0.8);
  fill(255);
  noStroke();
  triangle(0, -ship.size * 0.8, 
           -ship.size * 0.3, -ship.size * 0.6,
           ship.size * 0.3, -ship.size * 0.6);
}

function drawWake(ship) {
  // Draw wake trail
  noFill();
  stroke(255, 150);
  strokeWeight(1);
  
  beginShape();
  for (let i = 0; i < ship.trail.length; i++) {
    let point = ship.trail[i];
    let alpha = map(i, 0, ship.trail.length, 0, 200);
    stroke(255, alpha);
    vertex(point.x, point.y);
  }
  endShape();
  
  // Draw fading particles
  for (let i = 0; i < 3; i++) {
    let t = frameCount * 0.05 + i;
    let x = ship.x + random(-10, 10);
    let y = ship.y + random(-10, 10);
    let size = random(2, 6);
    
    noStroke();
    fill(255, 100);
    ellipse(x, y, size, size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
