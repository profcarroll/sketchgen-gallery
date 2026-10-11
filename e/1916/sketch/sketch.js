let ships = [];
let sedimentParticles = [];
let crystalGeodes = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create initial ships
  for (let i = 0; i < 8; i++) {
    ships.push({
      x: random(width),
      y: random(height * 0.2, height * 0.8),
      size: random(30, 60),
      speed: random(0.3, 1.0),
      angle: random(TWO_PI),
      decay: 0,
      trail: [],
      encased: false
    });
  }
  
  noStroke();
}

function draw() {
  // Very light translucent background to simulate deep time sediment
  background(200, 5, 95, 0.01);
  
  // Update and draw ships
  for (let i = ships.length - 1; i >= 0; i--) {
    let ship = ships[i];
    
    // Move ship
    ship.x += cos(ship.angle) * ship.speed;
    ship.y += sin(ship.angle) * ship.speed;
    
    // Add some sway
    ship.angle += sin(frameCount * 0.02 + i) * 0.03;
    
    // Boundary check - wrap around
    if (ship.x > width + 100) ship.x = -100;
    if (ship.x < -100) ship.x = width + 100;
    
    // Add decay over time
    ship.decay += 0.0005;
    
    // Create sediment trail
    if (frameCount % 3 === 0) {
      ship.trail.push({
        x: ship.x,
        y: ship.y,
        size: random(2, 5),
        life: 1.0
      });
    }
    
    // Limit trail length
    if (ship.trail.length > 20) {
      ship.trail.shift();
    }
    
    // Update sediment trail
    for (let j = ship.trail.length - 1; j >= 0; j--) {
      let p = ship.trail[j];
      p.life -= 0.01;
      
      if (p.life <= 0) {
        ship.trail.splice(j, 1);
      }
    }
    
    // Draw ship with paper cut effect
    push();
    translate(ship.x, ship.y);
    rotate(ship.angle);
    
    // Main ship body with patina effect
    fill(200, 5, 80, 0.9);
    stroke(200, 5, 60);
    strokeWeight(0.3);
    
    // Draw ship hull with slight warping
    beginShape();
    vertex(-ship.size * 0.4, -ship.size * 0.1 + sin(frameCount * 0.03 + i) * 1);
    vertex(ship.size * 0.3, -ship.size * 0.2 + cos(frameCount * 0.05 + i) * 1);
    vertex(ship.size * 0.6, ship.size * 0.1 + sin(frameCount * 0.04 + i) * 1);
    vertex(-ship.size * 0.2, ship.size * 0.1 + cos(frameCount * 0.06 + i) * 1);
    endShape(CLOSE);
    
    // Add moss effect
    fill(80, 50, 30, 0.7);
    ellipse(ship.size * 0.2, -ship.size * 0.1, ship.size * 0.2, ship.size * 0.15);
    
    // Draw sediment particles from trail
    for (let p of ship.trail) {
      fill(0, 0, 100, p.life * 0.7);
      noStroke();
      ellipse(p.x - ship.x, p.y - ship.y, p.size * p.life, p.size * p.life);
    }
    
    pop();
    
    // Encase hull in crystalline geode when decay is high
    if (!ship.encased && ship.decay > 0.3) {
      for (let j = 0; j < 15; j++) {
        crystalGeodes.push({
          x: ship.x + random(-ship.size * 1.2, ship.size * 1.2),
          y: ship.y + random(-ship.size * 1.2, ship.size * 1.2),
          size: random(2, 6),
          life: 1.0,
          age: 0,
          colorHue: 20 + (j % 3) * 20
        });
      }
      ship.encased = true;
    }
    
    // Occasionally remove ships
    if (ship.decay > 1.0 && random() < 0.001) {
      ships.splice(i, 1);
      
      // Add more sediment particles when ship is removed
      for (let j = 0; j < 20; j++) {
        sedimentParticles.push({
          x: ship.x,
          y: ship.y,
          size: random(1, 4),
          life: 1.0,
          speedX: random(-0.5, 0.5),
          speedY: random(-0.5, 0.5)
        });
      }
    }
  }
  
  // Update and draw sediment particles
  for (let i = sedimentParticles.length - 1; i >= 0; i--) {
    let p = sedimentParticles[i];
    
    p.x += p.speedX;
    p.y += p.speedY;
    p.life -= 0.005;
    
    if (p.life <= 0) {
      sedimentParticles.splice(i, 1);
      continue;
    }
    
    fill(0, 0, 90, p.life * 0.7);
    ellipse(p.x, p.y, p.size * p.life, p.size * p.life);
  }
  
  // Update and draw crystal geodes
  for (let i = crystalGeodes.length - 1; i >= 0; i--) {
    let geode = crystalGeodes[i];
    
    geode.age += 0.05;
    geode.life -= 0.002;
    
    if (geode.life <= 0) {
      crystalGeodes.splice(i, 1);
      continue;
    }
    
    // Draw crystalline structure
    push();
    translate(geode.x, geode.y);
    
    fill(geode.colorHue, 30, 90, geode.life * 0.6);
    noStroke();
    
    // Create a few crystal-like points
    for (let j = 0; j < 4; j++) {
      let angle = j * TWO_PI / 4 + geode.age * 0.1;
      let radius = geode.size * (0.5 + sin(geode.age * 0.3 + j) * 0.5);
      let x = cos(angle) * radius;
      let y = sin(angle) * radius;
      
      ellipse(x, y, geode.size * geode.life, geode.size * geode.life);
    }
    
    pop();
  }
  
  // Occasionally add new ships
  if (random() < 0.01 && ships.length < 12) {
    ships.push({
      x: random(width),
      y: random(height * 0.2, height * 0.8),
      size: random(30, 60),
      speed: random(0.3, 1.0),
      angle: random(TWO_PI),
      decay: 0,
      trail: [],
      encased: false
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
