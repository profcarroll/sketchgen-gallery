let dustDevils = [];
let cracks = [];
let scrubPlants = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB);
  
  // Create cracks
  for (let i = 0; i < 150; i++) {
    cracks.push({
      x: random(width),
      y: random(height * 0.6, height),
      len: random(30, 150),
      angle: random(TWO_PI),
      width: random(2, 8)
    });
  }
  
  // Create scrub plants
  for (let i = 0; i < 50; i++) {
    scrubPlants.push({
      x: random(width),
      y: random(height * 0.6, height),
      size: random(10, 30)
    });
  }
  
  // Create initial dust devils
  for (let i = 0; i < 8; i++) {
    dustDevils.push(createDustDevil());
  }
}

function draw() {
  // Draw sky with pale beige gradient
  background(245, 240, 230);
  
  // Draw ground with terracotta tones
  fill(180, 90, 60);
  noStroke();
  rect(0, height * 0.6, width, height * 0.4);
  
  // Draw cracks
  stroke(120, 60, 40);
  strokeWeight(2);
  for (let crack of cracks) {
    push();
    translate(crack.x, crack.y);
    rotate(crack.angle);
    line(0, 0, crack.len, 0);
    pop();
  }
  
  // Draw scrub plants
  fill(100, 80, 50);
  noStroke();
  for (let plant of scrubPlants) {
    ellipse(plant.x, plant.y, plant.size, plant.size * 0.6);
  }
  
  // Update and draw dust devils
  for (let i = dustDevils.length - 1; i >= 0; i--) {
    let devil = dustDevils[i];
    
    // Move the dust devil
    devil.x += devil.vx;
    devil.y += devil.vy;
    devil.angle += devil.rotationSpeed;
    devil.size *= devil.growthRate;
    
    // Draw the dust devil
    push();
    translate(devil.x, devil.y);
    rotate(devil.angle);
    
    // Draw swirling particles
    noStroke();
    fill(150, 100, 80, 150);
    for (let j = 0; j < 5; j++) {
      let angle = j * TWO_PI / 5;
      let px = cos(angle) * devil.size * 0.7;
      let py = sin(angle) * devil.size * 0.7;
      ellipse(px, py, devil.size * 0.2, devil.size * 0.2);
    }
    
    // Draw central swirl
    fill(120, 80, 60, 200);
    ellipse(0, 0, devil.size * 0.3, devil.size * 0.3);
    
    pop();
    
    // Remove dead dust devils and create new ones
    if (devil.size > 100 || devil.size < 5) {
      dustDevils.splice(i, 1);
      dustDevils.push(createDustDevil());
    }
  }
}

function createDustDevil() {
  return {
    x: random(width),
    y: height * 0.6,
    vx: random(-1, 1),
    vy: -random(0.5, 2),
    angle: random(TWO_PI),
    rotationSpeed: random(-0.05, 0.05),
    size: random(10, 30),
    growthRate: random(1.005, 1.02)
  };
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
