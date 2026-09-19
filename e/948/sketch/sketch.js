let crystals = [];
let tunnelSpeed = 0;
let pulsePhase = 0;

function setup() {
  createCanvas(400, 400, WEBGL);
  noStroke();
  
  // Create initial crystals
  for (let i = 0; i < 150; i++) {
    crystals.push({
      x: random(-200, 200),
      y: random(-200, 200),
      z: random(-1000, -100),
      size: random(5, 20),
      rotationX: random(TWO_PI),
      rotationY: random(TWO_PI),
      rotationZ: random(TWO_PI),
      pulse: random(1),
      color: color(random(100, 255), random(200, 255), random(100, 200), 200)
    });
  }
}

function draw() {
  background(0);
  
  // Accelerate tunnel
  tunnelSpeed += 0.05;
  pulsePhase += 0.03;
  
  // Draw crystals
  for (let crystal of crystals) {
    push();
    
    // Move crystal forward
    crystal.z += tunnelSpeed;
    
    // Reset if too far
    if (crystal.z > 100) {
      crystal.z = random(-1000, -100);
      crystal.x = random(-200, 200);
      crystal.y = random(-200, 200);
    }
    
    translate(crystal.x, crystal.y, crystal.z);
    
    // Rotate
    rotateX(crystal.rotationX + pulsePhase * 0.1);
    rotateY(crystal.rotationY + pulsePhase * 0.2);
    rotateZ(crystal.rotationZ + pulsePhase * 0.3);
    
    // Pulse effect
    let pulse = sin(pulsePhase + crystal.pulse) * 0.5 + 0.5;
    let scale = crystal.size * (1 + pulse * 0.3);
    
    // Draw crystal as complex geometric shape
    fill(crystal.color);
    drawCrystal(scale);
    
    pop();
  }
}

function drawCrystal(size) {
  // Create a multi-faceted crystal shape using rotation and scaling
  for (let i = 0; i < 8; i++) {
    push();
    rotateZ(i * TWO_PI / 8);
    rotateX(PI/4);
    scale(1, 1, size * 0.7);
    box(size * 0.3, size * 0.3, size);
    pop();
  }
  
  // Central core
  push();
  scale(size * 0.2);
  sphere(size * 0.5);
  pop();
}
