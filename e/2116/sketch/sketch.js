let structures = [];
let particles = [];

class CrystalStructure {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.growth = 0;
    this.maxGrowth = random(100, 300);
    this.angle = random(TWO_PI);
    this.speed = random(0.005, 0.02);
    this.segments = [];
    this.hue = random(180, 240);
    this.saturation = random(60, 90);
    this.brightness = random(70, 100);
  }
  
  update() {
    this.growth += this.speed;
    if (this.growth > this.maxGrowth) {
      this.growth = this.maxGrowth;
    }
    
    // Generate segments for crystal structure
    this.segments = [];
    const numSegments = floor(this.growth / 10);
    for (let i = 0; i < numSegments; i++) {
      const angle = this.angle + i * 0.5;
      const radius = i * 3;
      const x = this.x + cos(angle) * radius;
      const y = this.y + sin(angle) * radius;
      this.segments.push({x, y});
    }
  }
  
  display() {
    if (this.segments.length < 2) return;
    
    stroke(this.hue, this.saturation, this.brightness, 150);
    noFill();
    strokeWeight(1);
    
    beginShape();
    for (let i = 0; i < this.segments.length; i++) {
      const segment = this.segments[i];
      vertex(segment.x, segment.y);
    }
    endShape();
    
    // Draw interference patterns
    stroke(this.hue + 120, this.saturation, this.brightness, 80);
    strokeWeight(0.5);
    for (let i = 0; i < this.segments.length - 1; i += 2) {
      const start = this.segments[i];
      const end = this.segments[i + 1];
      line(start.x, start.y, end.x, end.y);
    }
  }
}

class Particle {
  constructor() {
    this.reset();
  }
  
  reset() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(0.5, 2);
    this.speedX = random(-0.5, 0.5);
    this.speedY = random(-0.5, 0.5);
    this.hue = random(180, 240);
    this.brightness = random(60, 90);
    this.alpha = random(50, 150);
    this.lifespan = random(100, 300);
    this.age = 0;
  }
  
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    
    // Boundary check
    if (this.x < -this.size || this.x > width + this.size ||
        this.y < -this.size || this.y > height + this.size) {
      this.reset();
    }
    
    this.age++;
    this.alpha = map(this.age, 0, this.lifespan, 150, 0);
  }
  
  display() {
    noStroke();
    fill(this.hue, 80, this.brightness, this.alpha);
    ellipse(this.x, this.y, this.size);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);
  
  // Initialize crystal structures
  for (let i = 0; i < 5; i++) {
    structures.push(new CrystalStructure(random(width), random(height)));
  }
  
  // Initialize particles
  for (let i = 0; i < 1000; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(10, 10, 20, 30); // Semi-transparent background for trail effect
  
  // Update and display structures
  for (let structure of structures) {
    structure.update();
    structure.display();
    
    // Occasionally spawn new structures
    if (random() < 0.001) {
      structures.push(new CrystalStructure(random(width), random(height)));
    }
    
    // Remove old structures
    if (structure.growth >= structure.maxGrowth) {
      const index = structures.indexOf(structure);
      if (index > -1) structures.splice(index, 1);
    }
  }
  
  // Update and display particles
  for (let particle of particles) {
    particle.update();
    particle.display();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
