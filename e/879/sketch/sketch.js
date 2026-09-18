let filaments = [];
let minerals = [];
let substrate;
let time = 0;

class Filament {
  constructor(x, y, z) {
    this.pos = createVector(x, y, z);
    this.vel = p5.Vector.random3D().mult(random(0.1, 0.3));
    this.age = 0;
    this.length = 0;
    this.segments = [];
    this.maxSegments = 50;
    this.thickness = random(0.5, 2);
    this.color = color(120, 100, 80, 200);
  }

  update() {
    this.age += 0.02;
    this.length += 0.1;
    
    if (this.segments.length >= this.maxSegments) {
      this.segments.shift();
    }
    
    this.segments.push(this.pos.copy());
    
    // Slowly change direction
    this.vel.rotate(random(-0.05, 0.05));
    this.vel.normalize().mult(0.1);
    
    this.pos.add(this.vel);
    
    // Occasionally grow thicker
    if (random() < 0.02) {
      this.thickness += random(0.1, 0.3);
    }
    
    // Occasionally deposit mineral
    if (random() < 0.01 && this.age > 1) {
      minerals.push(new Mineral(this.pos.x, this.pos.y, this.pos.z));
    }
  }

  display() {
    push();
    stroke(this.color);
    strokeWeight(this.thickness);
    noFill();
    
    beginShape();
    for (let i = 0; i < this.segments.length; i++) {
      const pos = this.segments[i];
      vertex(pos.x, pos.y, pos.z);
    }
    endShape();
    
    pop();
  }
}

class Mineral {
  constructor(x, y, z) {
    this.pos = createVector(x, y, z);
    this.size = random(2, 6);
    this.growth = 0;
    this.maxGrowth = random(50, 100);
    this.color = color(
      random(180, 255),
      random(150, 200),
      random(100, 150),
      150
    );
  }

  update() {
    this.growth += 0.5;
  }

  display() {
    push();
    fill(this.color);
    noStroke();
    
    // Draw a crystalline structure using multiple spheres
    for (let i = 0; i < 4; i++) {
      const angle = map(i, 0, 4, 0, TWO_PI);
      const offsetX = sin(angle) * this.size;
      const offsetZ = cos(angle) * this.size;
      
      sphere(this.size + this.growth * 0.1, 3, 2);
    }
    
    pop();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  substrate = createGraphics(width, height);
  substrate.background(40, 50, 30);
  
  // Create initial filaments
  for (let i = 0; i < 10; i++) {
    const x = random(-width/2, width/2);
    const y = random(-height/2, height/2);
    const z = random(-50, 50);
    filaments.push(new Filament(x, y, z));
  }
  
  frameRate(30);
}

function draw() {
  background(10, 15, 20);
  time += 0.01;
  
  // Ambient lighting
  ambientLight(40);
  pointLight(255, 255, 255, 0, -height/2, 0);
  pointLight(200, 200, 255, 0, height/2, 0);
  
  // Move camera
  const camX = sin(time * 0.1) * 300;
  const camY = cos(time * 0.1) * 100;
  const camZ = 300 + sin(time * 0.05) * 100;
  camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);
  
  // Draw substrate
  texture(substrate);
  plane(width, height);
  
  // Update and display filaments
  for (let i = filaments.length - 1; i >= 0; i--) {
    const f = filaments[i];
    f.update();
    f.display();
    
    // Occasionally spawn new filaments
    if (random() < 0.002) {
      filaments.push(new Filament(f.pos.x, f.pos.y, f.pos.z));
    }
    
    // Remove old filaments
    if (f.age > 10) {
      filaments.splice(i, 1);
    }
  }
  
  // Update and display minerals
  for (let i = minerals.length - 1; i >= 0; i--) {
    const m = minerals[i];
    m.update();
    m.display();
    
    if (m.growth > m.maxGrowth) {
      minerals.splice(i, 1);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
