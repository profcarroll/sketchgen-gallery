let particles = [];
let isAssembling = false;
let assemblyTimer = 0;
let cameraZ = 0;
let structurePoints = [];

class Particle {
  constructor() {
    this.reset();
    this.size = random(0.5, 2);
    this.color = color(200, 200, 220, 200);
  }

  reset() {
    this.x = random(-width/2, width/2);
    this.y = random(-height/2, height/2);
    this.z = random(-1000, 1000);
    this.vx = random(-0.5, 0.5);
    this.vy = random(-0.05, 0.05);
    this.vz = random(-0.5, 0.5);
  }

  update() {
    if (!isAssembling) {
      // Brownian motion
      this.x += this.vx + random(-0.2, 0.2);
      this.y += this.vy + random(-0.2, 0.2);
      this.z += this.vz + random(-0.2, 0.2);
    } else {
      // Move towards target position
      let target = this.getTargetPosition();
      let dx = target.x - this.x;
      let dy = target.y - this.y;
      let dz = target.z - this.z;
      
      this.x += dx * 0.1;
      this.y += dy * 0.1;
      this.z += dz * 0.1;
    }
    
    // Keep particles in bounds
    if (this.x < -width || this.x > width) this.reset();
    if (this.y < -height || this.y > height) this.reset();
    if (this.z < -2000 || this.z > 2000) this.reset();
  }

  getTargetPosition() {
    // Return target position based on assembly phase
    let idx = particles.indexOf(this);
    let x, y, z;
    
    if (assemblyTimer < 100) {
      // Spiral pattern
      let t = assemblyTimer * 0.1 + idx * 0.05;
      x = sin(t) * 200;
      y = cos(t) * 200;
      z = -sin(t * 0.5) * 100;
    } else {
      // Complex structure (cube)
      let gridSize = 10;
      let row = floor(idx / (gridSize * gridSize));
      let col = floor((idx % (gridSize * gridSize)) / gridSize);
      let layer = idx % gridSize;
      
      x = (col - gridSize/2) * 40;
      y = (row - gridSize/2) * 40;
      z = (layer - gridSize/2) * 40;
    }
    
    return {x, y, z};
  }

  display() {
    // Just a point for performance
    point(this.x, this.y, this.z);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  windowResized();
  
  // Create particles
  for (let i = 0; i < 2000; i++) {
    particles.push(new Particle());
  }
  
  // Initialize camera
  cameraZ = -500;
}

function draw() {
  background(0);
  
  // Camera movement
  cameraZ += (0 - cameraZ) * 0.05;
  perspective(PI/3, width/height, 1, 5000);
  
  // Set up lighting for polished steel look
  ambientLight(60);
  directionalLight(255, 255, 255, 1, 1, -1);
  pointLight(255, 255, 255, width/2, height/2, 500);
  
  // Batch all particles into one shape
  push();
  stroke(200, 200, 220, 200);
  strokeWeight(1);
  noFill();
  beginShape(POINTS);
  for (let p of particles) {
    p.update();
    p.display();
  }
  endShape();
  pop();
  
  // Assembly animation
  if (isAssembling) {
    assemblyTimer++;
    if (assemblyTimer > 200) {
      isAssembling = false;
      assemblyTimer = 0;
    }
  }
}

function mousePressed() {
  if (!isAssembling) {
    isAssembling = true;
    assemblyTimer = 0;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
