let ships = [];
let wakes = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Create initial ships
  for (let i = 0; i < 8; i++) {
    ships.push({
      x: random(width),
      y: random(height),
      angle: random(TWO_PI),
      speed: random(0.5, 1.5),
      size: random(20, 40),
      wake: []
    });
  }
}

function draw() {
  // Translucent background to simulate aqueous medium
  background(200, 10, 90, 0.03);
  
  // Update and draw ships
  for (let ship of ships) {
    // Move ship
    ship.x += cos(ship.angle) * ship.speed;
    ship.y += sin(ship.angle) * ship.speed;
    
    // Wrap around screen edges
    if (ship.x < -50) ship.x = width + 50;
    if (ship.x > width + 50) ship.x = -50;
    if (ship.y < -50) ship.y = height + 50;
    if (ship.y > height + 50) ship.y = -50;
    
    // Add to wake
    ship.wake.push({x: ship.x, y: ship.y, life: 1.0});
    if (ship.wake.length > 30) {
      ship.wake.shift();
    }
    
    // Draw ship body
    push();
    translate(ship.x, ship.y);
    rotate(ship.angle);
    
    // Ship hull - paper-cut style
    fill(220, 30, 95, 0.8);
    beginShape();
    vertex(-ship.size * 0.6, 0);
    vertex(ship.size * 0.6, -ship.size * 0.3);
    vertex(ship.size * 0.6, ship.size * 0.3);
    endShape(CLOSE);
    
    // Ship sail
    fill(240, 80, 95, 0.7);
    triangle(
      ship.size * 0.2, -ship.size * 0.1,
      ship.size * 0.2, ship.size * 0.1,
      ship.size * 0.8, 0
    );
    
    pop();
  }
  
  // Draw wakes as crystalline sediment trails
  for (let ship of ships) {
    for (let i = 0; i < ship.wake.length - 1; i++) {
      let p1 = ship.wake[i];
      let p2 = ship.wake[i + 1];
      
      // Calculate trail thickness based on wake age
      let thickness = map(i, 0, ship.wake.length - 1, 0.5, 3);
      
      // Draw trail as solid crystalline segments
      stroke(200, 20, 85, p1.life * 0.6);
      strokeWeight(thickness);
      line(p1.x, p1.y, p2.x, p2.y);
    }
  }
  
  // Occasionally add new ships for dynamic effect
  if (random() < 0.01 && ships.length < 15) {
    ships.push({
      x: random(width),
      y: random(height),
      angle: random(TWO_PI),
      speed: random(0.5, 1.5),
      size: random(20, 40),
      wake: []
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
