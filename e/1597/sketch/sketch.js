let ships = [];
let saltParticles = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create initial ships
  for (let i = 0; i < 5; i++) {
    ships.push({
      x: random(width),
      y: random(height * 0.3, height * 0.7),
      size: random(40, 80),
      speed: random(0.5, 1.5),
      angle: random(TWO_PI),
      decay: 0,
      tears: [],
      saltTrail: []
    });
  }
  
  noStroke();
}

function draw() {
  background(200, 10, 95, 0.02); // Very light translucent background
  
  time += 0.01;
  
  // Update and draw ships
  for (let i = ships.length - 1; i >= 0; i--) {
    let ship = ships[i];
    
    // Move ship
    ship.x += cos(ship.angle) * ship.speed;
    ship.y += sin(ship.angle) * ship.speed;
    
    // Add some sway
    ship.angle += sin(time * 0.5 + i) * 0.02;
    
    // Boundary check - wrap around
    if (ship.x > width + 100) ship.x = -100;
    if (ship.x < -100) ship.x = width + 100;
    
    // Add decay over time
    ship.decay += 0.001;
    
    // Create salt trail
    if (frameCount % 3 === 0) {
      ship.saltTrail.push({
        x: ship.x,
        y: ship.y,
        size: random(2, 6),
        life: 1.0
      });
    }
    
    // Limit trail length
    if (ship.saltTrail.length > 20) {
      ship.saltTrail.shift();
    }
    
    // Update salt trail
    for (let j = ship.saltTrail.length - 1; j >= 0; j--) {
      let p = ship.saltTrail[j];
      p.life -= 0.02;
      if (p.life <= 0) {
        ship.saltTrail.splice(j, 1);
      }
    }
    
    // Add random tears
    if (random() < 0.02) {
      ship.tears.push({
        x: random(-ship.size * 0.3, ship.size * 0.3),
        y: random(-ship.size * 0.3, ship.size * 0.3),
        size: random(5, 15),
        life: 1.0
      });
    }
    
    // Update tears
    for (let j = ship.tears.length - 1; j >= 0; j--) {
      let tear = ship.tears[j];
      tear.life -= 0.005;
      tear.x += random(-0.5, 0.5);
      tear.y += random(-0.5, 0.5);
      
      if (tear.life <= 0) {
        ship.tears.splice(j, 1);
      }
    }
    
    // Draw ship with paper cut effect
    push();
    translate(ship.x, ship.y);
    rotate(ship.angle);
    
    // Main ship body with patina effect
    fill(200, 5, 80 + sin(time * 2 + i) * 10, 0.9);
    stroke(200, 5, 60);
    strokeWeight(0.5);
    
    // Draw ship hull with slight warping
    beginShape();
    vertex(-ship.size * 0.4, -ship.size * 0.1 + sin(time + i) * 2);
    vertex(ship.size * 0.3, -ship.size * 0.2 + cos(time * 1.5 + i) * 2);
    vertex(ship.size * 0.6, ship.size * 0.1 + sin(time * 0.7 + i) * 2);
    vertex(-ship.size * 0.2, ship.size * 0.1 + cos(time * 1.3 + i) * 2);
    endShape(CLOSE);
    
    // Add moss effect
    fill(80, 50, 30, 0.7);
    ellipse(ship.size * 0.2, -ship.size * 0.1, ship.size * 0.3, ship.size * 0.2);
    
    // Draw salt particles from trail
    for (let p of ship.saltTrail) {
      fill(0, 0, 100, p.life * 0.7);
      ellipse(p.x - ship.x, p.y - ship.y, p.size * p.life, p.size * p.life);
    }
    
    // Draw tears
    for (let tear of ship.tears) {
      fill(200, 10, 95, tear.life * 0.6);
      noStroke();
      ellipse(tear.x, tear.y, tear.size * tear.life, tear.size * tear.life);
    }
    
    pop();
    
    // Occasionally remove ships
    if (ship.decay > 1.0 && random() < 0.005) {
      ships.splice(i, 1);
      
      // Add more salt particles when ship is removed
      for (let j = 0; j < 30; j++) {
        saltParticles.push({
          x: ship.x,
          y: ship.y,
          size: random(2, 8),
          life: 1.0,
          speedX: random(-1, 1),
          speedY: random(-1, 1)
        });
      }
    }
  }
  
  // Update and draw salt particles
  for (let i = saltParticles.length - 1; i >= 0; i--) {
    let p = saltParticles[i];
    
    p.x += p.speedX;
    p.y += p.speedY;
    p.life -= 0.01;
    
    if (p.life <= 0) {
      saltParticles.splice(i, 1);
      continue;
    }
    
    fill(0, 0, 100, p.life * 0.8);
    ellipse(p.x, p.y, p.size * p.life, p.size * p.life);
  }
  
  // Occasionally add new ships
  if (random() < 0.02 && ships.length < 8) {
    ships.push({
      x: random(width),
      y: random(height * 0.3, height * 0.7),
      size: random(40, 80),
      speed: random(0.5, 1.5),
      angle: random(TWO_PI),
      decay: 0,
      tears: [],
      saltTrail: []
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
