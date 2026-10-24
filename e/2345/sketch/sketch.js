let crystals = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  
  // Create many crystalline structures
  for (let i = 0; i < 500; i++) {
    crystals.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-1000, 1000),
      size: random(5, 30),
      rotationX: random(TWO_PI),
      rotationY: random(TWO_PI),
      rotationZ: random(TWO_PI),
      rotationSpeedX: random(-0.002, 0.002),
      rotationSpeedY: random(-0.002, 0.002),
      rotationSpeedZ: random(-0.002, 0.002),
      hue: random(180, 240), // Iridescent blue-green
      saturation: random(60, 90),
      brightness: random(70, 95),
      alpha: random(150, 200),
      decay: random(0.99, 0.999), // Slowly dissolving
      speedX: random(-0.1, 0.1),
      speedY: random(-0.1, 0.1),
      speedZ: random(-0.1, 0.1),
      age: 0,
      life: random(500, 2000)
    });
  }
}

function draw() {
  background(10, 15, 20);
  
  time += 0.001;
  
  // Draw all crystals
  for (let crystal of crystals) {
    // Update position and rotation
    crystal.x += crystal.speedX;
    crystal.y += crystal.speedY;
    crystal.z += crystal.speedZ;
    
    crystal.rotationX += crystal.rotationSpeedX;
    crystal.rotationY += crystal.rotationSpeedY;
    crystal.rotationZ += crystal.rotationSpeedZ;
    
    // Age the crystal
    crystal.age++;
    
    // Slowly dissolve
    crystal.size *= crystal.decay;
    
    // Fade out as it ages
    crystal.alpha = map(crystal.age, 0, crystal.life, 255, 0);
    
    // Reset if too small or old
    if (crystal.size < 0.1 || crystal.age > crystal.life) {
      crystal.x = random(-width/2, width/2);
      crystal.y = random(-height/2, height/2);
      crystal.z = random(-1000, 1000);
      crystal.size = random(5, 30);
      crystal.age = 0;
      crystal.hue = random(180, 240);
      crystal.decay = random(0.99, 0.999);
    }
    
    // Draw the crystal
    push();
    translate(crystal.x, crystal.y, crystal.z);
    rotateX(crystal.rotationX);
    rotateY(crystal.rotationY);
    rotateZ(crystal.rotationZ);
    
    // Create an iridescent effect using color shifts
    let shift = sin(time * 0.5 + crystal.age * 0.01) * 20;
    fill(crystal.hue + shift, crystal.saturation, crystal.brightness, crystal.alpha);
    
    // Draw the crystal as a polyhedron
    drawCrystal(crystal.size);
    pop();
  }
}

function drawCrystal(size) {
  // Draw a simple polyhedral crystal structure
  for (let i = 0; i < 6; i++) {
    push();
    rotateZ(i * TWO_PI / 6);
    rotateX(PI/6);
    scale(1, 1, size/20);
    box(size/3, size/3, size);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
