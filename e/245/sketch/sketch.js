let ships = [];
let trails = [];

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create initial ships
  for (let i = 0; i < 5; i++) {
    ships.push({
      x: random(width),
      y: random(height),
      speed: random(0.5, 1.5),
      size: random(20, 40),
      angle: random(TWO_PI),
      hue: random(360)
    });
  }
}

function draw() {
  background(220, 10, 95, 0.05); // Semi-transparent background for trail fading
  
  // Update and draw ships
  for (let i = ships.length - 1; i >= 0; i--) {
    let ship = ships[i];
    
    // Move ship
    ship.x += cos(ship.angle) * ship.speed;
    ship.y += sin(ship.angle) * ship.speed;
    
    // Add trail point
    trails.push({
      x: ship.x,
      y: ship.y,
      life: 1.0,
      hue: ship.hue
    });
    
    // Draw ship
    push();
    translate(ship.x, ship.y);
    rotate(ship.angle);
    
    // Ship body (paper-cut style)
    fill(ship.hue, 80, 90);
    noStroke();
    ellipse(0, 0, ship.size, ship.size * 0.6);
    
    // Sail
    fill(ship.hue, 100, 100);
    triangle(-ship.size * 0.2, -ship.size * 0.3,
             ship.size * 0.2, -ship.size * 0.3,
             0, -ship.size * 0.8);
    
    // Mast
    stroke(ship.hue, 100, 50);
    strokeWeight(2);
    line(0, -ship.size * 0.3, 0, ship.size * 0.3);
    
    pop();
    
    // Remove ships that leave the canvas
    if (ship.x < -50 || ship.x > width + 50 || 
        ship.y < -50 || ship.y > height + 50) {
      ships.splice(i, 1);
    }
  }
  
  // Update and draw trails
  for (let i = trails.length - 1; i >= 0; i--) {
    let trail = trails[i];
    trail.life -= 0.01;
    
    if (trail.life <= 0) {
      trails.splice(i, 1);
      continue;
    }
    
    // Draw trail
    let alpha = trail.life * 0.5;
    stroke(trail.hue, 80, 90, alpha);
    strokeWeight(2);
    point(trail.x, trail.y);
  }
  
  // Add new ships occasionally
  if (random() < 0.02) {
    ships.push({
      x: random(width),
      y: random(height),
      speed: random(0.5, 1.5),
      size: random(20, 40),
      angle: random(TWO_PI),
      hue: random(360)
    });
  }
}
