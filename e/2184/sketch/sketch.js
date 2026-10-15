let fibers = [];
let spicules = [];
let steamParticles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  frameRate(30);
  
  // Create initial fibers (wool)
  for (let i = 0; i < 200; i++) {
    fibers.push({
      x: width/2,
      y: height/2,
      vx: random(-2, 2),
      vy: random(-2, 2),
      hue: random(20, 40), // Earth tones
      saturation: random(30, 60),
      brightness: random(50, 80),
      size: random(1, 3),
      age: 0,
      segments: floor(random(3, 8)),
      history: []
    });
  }
  
  // Create spicules (silica)
  for (let i = 0; i < 150; i++) {
    spicules.push({
      x: random(width),
      y: random(height),
      size: random(2, 8),
      hue: random(10, 30), // Warm earth tones
      saturation: random(20, 40),
      brightness: random(40, 70),
      angle: random(TWO_PI),
      speed: random(0.5, 2)
    });
  }
  
  // Create steam particles
  for (let i = 0; i < 300; i++) {
    steamParticles.push({
      x: width/2,
      y: height/2,
      vx: random(-1, 1),
      vy: random(-1, 1),
      size: random(0.5, 2),
      life: random(50, 150),
      age: 0
    });
  }
}

function draw() {
  background(0, 0, 5, 0.05); // Very subtle fade for stillness
  
  // Update and display fibers (wool)
  for (let fiber of fibers) {
    // Apply steam pressure (superheated)
    let steamForce = 0.02;
    fiber.vx += random(-steamForce, steamForce);
    fiber.vy += random(-steamForce, steamForce);
    
    // Update position
    fiber.x += fiber.vx;
    fiber.y += fiber.vy;
    
    // Add to history for trail effect
    fiber.history.push({x: fiber.x, y: fiber.y});
    if (fiber.history.length > 10) {
      fiber.history.shift();
    }
    
    // Draw trail
    noFill();
    stroke(fiber.hue, fiber.saturation, fiber.brightness, 0.3);
    strokeWeight(0.5);
    beginShape();
    for (let pos of fiber.history) {
      vertex(pos.x, pos.y);
    }
    endShape();
    
    // Draw main fiber
    stroke(fiber.hue, fiber.saturation, fiber.brightness, 0.8);
    strokeWeight(fiber.size);
    point(fiber.x, fiber.y);
    
    // Age the fiber
    fiber.age++;
  }
  
  // Update and display spicules (silica)
  for (let spicule of spicules) {
    // Apply steam pressure
    let steamForce = 0.01;
    spicule.vx += random(-steamForce, steamForce);
    spicule.vy += random(-steamForce, steamForce);
    
    // Update position
    spicule.x += spicule.vx;
    spicule.y += spicule.vy;
    
    // Boundary check
    if (spicule.x < 0 || spicule.x > width || spicule.y < 0 || spicule.y > height) {
      spicule.x = random(width);
      spicule.y = random(height);
    }
    
    // Draw spicule
    fill(spicule.hue, spicule.saturation, spicule.brightness, 0.8);
    noStroke();
    ellipse(spicule.x, spicule.y, spicule.size);
  }
  
  // Update and display steam particles
  for (let i = steamParticles.length - 1; i >= 0; i--) {
    let p = steamParticles[i];
    
    // Apply upward force from steam
    p.vy -= 0.05;
    
    // Update position
    p.x += p.vx;
    p.y += p.vy;
    
    // Age particle
    p.age++;
    
    // Remove old particles
    if (p.age > p.life) {
      steamParticles.splice(i, 1);
      continue;
    }
    
    // Draw steam particle
    let alpha = map(p.age, 0, p.life, 0.8, 0);
    fill(200, 50, 90, alpha); // Light blue-gray
    noStroke();
    ellipse(p.x, p.y, p.size);
  }
  
  // Occasionally add new steam particles
  if (random() < 0.1) {
    steamParticles.push({
      x: width/2,
      y: height/2,
      vx: random(-0.5, 0.5),
      vy: random(-1, -0.5),
      size: random(0.5, 2),
      life: random(50, 150),
      age: 0
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
