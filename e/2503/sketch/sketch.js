let pendulumAngle = 0;
let pendulumSpeed = 0;
let crystalStructures = [];
let noiseOffset = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize crystal structures
  for (let i = 0; i < 20; i++) {
    crystalStructures.push({
      x: random(width),
      y: random(height),
      size: random(50, 150),
      growth: 0,
      hue: random(200, 300),
      time: random(TWO_PI)
    });
  }
  
  // Start with pendulum at rest
  pendulumSpeed = 0.005;
}

function draw() {
  background(0);
  
  // Update pendulum physics
  pendulumAngle += pendulumSpeed;
  pendulumSpeed *= 0.999; // Damping
  
  // Apply pendulum force to crystal growth
  let pendulumForce = sin(pendulumAngle) * 0.5 + 0.5;
  
  // Draw crystals with evolving patterns
  for (let i = 0; i < crystalStructures.length; i++) {
    let crystal = crystalStructures[i];
    
    push();
    translate(crystal.x, crystal.y);
    
    // Rotate based on pendulum position
    rotate(pendulumAngle * 2 + crystal.time);
    
    // Growth based on pendulum force
    crystal.growth += pendulumForce * 0.02;
    
    // Draw crystal structure
    stroke(crystal.hue, 80, 100, 0.7);
    strokeWeight(1);
    noFill();
    
    // Base crystal shape
    let baseSize = crystal.size * (0.5 + crystal.growth * 0.5);
    beginShape();
    for (let j = 0; j < 6; j++) {
      let angle = TWO_PI * j / 6;
      let x = cos(angle) * baseSize;
      let y = sin(angle) * baseSize;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Inner crystal details
    stroke(crystal.hue, 100, 80, 0.5);
    for (let j = 0; j < 6; j++) {
      let angle = TWO_PI * j / 6;
      let x1 = cos(angle) * baseSize * 0.3;
      let y1 = sin(angle) * baseSize * 0.3;
      let x2 = cos(angle) * baseSize * 0.7;
      let y2 = sin(angle) * baseSize * 0.7;
      
      line(x1, y1, x2, y2);
    }
    
    // Add branching structures
    stroke(crystal.hue, 90, 90, 0.6);
    for (let j = 0; j < 8; j++) {
      let angle = TWO_PI * j / 8 + crystal.time;
      let branchLength = baseSize * 0.3;
      
      // Add some noise to branching
      let noiseVal = noise(noiseOffset + j * 0.1) * 0.5 + 0.5;
      let branchAngle = angle + (noiseVal - 0.5) * 0.5;
      
      let x1 = cos(angle) * baseSize * 0.5;
      let y1 = sin(angle) * baseSize * 0.5;
      let x2 = cos(branchAngle) * branchLength;
      let y2 = sin(branchAngle) * branchLength;
      
      line(x1, y1, x1 + x2, y1 + y2);
    }
    
    pop();
    
    // Slowly reset crystals occasionally
    if (random() < 0.001) {
      crystal.growth = 0;
      crystal.hue += random(-20, 20);
      if (crystal.hue < 0) crystal.hue += 360;
      if (crystal.hue > 360) crystal.hue -= 360;
    }
  }
  
  // Update noise offset for animation
  noiseOffset += 0.01;
  
  // Create new crystals occasionally
  if (random() < 0.02) {
    crystalStructures.push({
      x: random(width),
      y: random(height),
      size: random(50, 150),
      growth: 0,
      hue: random(200, 300),
      time: random(TWO_PI)
    });
    
    // Limit number of crystals
    if (crystalStructures.length > 50) {
      crystalStructures.splice(0, 1);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
