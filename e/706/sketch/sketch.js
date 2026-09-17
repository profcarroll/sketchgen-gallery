let fragments = [];
let faultLines = [];

class Fragment {
  constructor(x, y, z) {
    this.pos = createVector(x, y, z);
    this.vel = p5.Vector.random3D().mult(random(0.1, 0.5));
    this.size = random(5, 20);
    this.color = color(random(150, 255), random(20, 60), random(20, 80), 200);
    this.rotation = random(TWO_PI);
    this.rotationSpeed = random(-0.02, 0.02);
    this.waveOffset = random(TWO_PI);
  }

  update() {
    this.pos.add(this.vel);
    this.rotation += this.rotationSpeed;
    this.waveOffset += 0.03;
    
    // Slowly move towards center to simulate decay
    let center = createVector(0, 0, 0);
    this.pos.lerp(center, 0.001);
    
    // Apply wave motion
    this.pos.x += sin(this.waveOffset) * 0.5;
    this.pos.y += cos(this.waveOffset) * 0.5;
    this.pos.z += sin(this.waveOffset * 0.7) * 0.3;
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    rotateX(this.rotation);
    rotateY(this.rotation * 0.5);
    
    noStroke();
    fill(this.color);
    sphere(this.size, 4, 3); // Low detail for performance
    
    pop();
  }
}

class FaultLine {
  constructor() {
    this.points = [];
    this.segments = random(10, 20);
    this.width = random(2, 6);
    this.color = color(random(150, 255), 0, 0, 150); // Crimson
    this.growth = 0;
    this.maxGrowth = random(30, 100);
    this.offset = random(TWO_PI);
  }

  update() {
    this.growth += 0.5;
    if (this.growth > this.maxGrowth) {
      this.growth = 0;
      this.points = [];
      this.maxGrowth = random(30, 100);
    }
  }

  display() {
    if (this.points.length < 2) return;

    stroke(this.color);
    strokeWeight(this.width * (this.growth / this.maxGrowth));
    noFill();
    
    beginShape();
    for (let i = 0; i < this.points.length; i++) {
      let point = this.points[i];
      vertex(point.x, point.y, point.z);
    }
    endShape();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 255);
  
  // Create initial fragments
  for (let i = 0; i < 800; i++) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let z = random(-100, 100);
    fragments.push(new Fragment(x, y, z));
  }
  
  // Create fault lines
  for (let i = 0; i < 15; i++) {
    faultLines.push(new FaultLine());
  }
}

function draw() {
  background(20, 10, 10); // Dark red background
  
  // Center the scene
  translate(0, 0, -300);
  
  // Rotate slowly
  rotateY(frameCount * 0.001);
  
  // Update and display fragments
  for (let fragment of fragments) {
    fragment.update();
    fragment.display();
  }
  
  // Update and display fault lines
  for (let line of faultLines) {
    line.update();
    
    // Add new points occasionally
    if (line.growth > 0 && random() < 0.1) {
      let x = random(-width/3, width/3);
      let y = random(-height/3, height/3);
      let z = random(-100, 100);
      line.points.push(createVector(x, y, z));
    }
    
    line.display();
  }
  
  // Occasionally create new fault lines
  if (random() < 0.02) {
    faultLines.push(new FaultLine());
    if (faultLines.length > 25) {
      faultLines.shift();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
