let crackProgress = 0;
let rootSystem;
let cameraAngleX = 0;
let cameraAngleY = 0;
let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize root system with branching structure
  rootSystem = new RootSystem();
}

function draw() {
  background(20, 5, 5); // Deep dark background
  
  // Animate crack spreading
  crackProgress += 0.002;
  
  // Camera setup for isometric view
  camera(
    800 * cos(cameraAngleX) * cos(cameraAngleY),
    800 * sin(cameraAngleY),
    800 * sin(cameraAngleX) * cos(cameraAngleY),
    0, 0, 0,
    0, 1, 0
  );
  
  // Perspective projection
  perspective(PI/3, width/height, 100, 10000);
  
  // Draw crack effect
  drawCrack();
  
  // Draw root system
  rootSystem.update();
  rootSystem.display();
}

function drawCrack() {
  // Draw the spreading crack
  noFill();
  stroke(0, 0, 100, 0.8);
  strokeWeight(2);
  
  // Draw multiple crack segments
  for (let i = 0; i < 5; i++) {
    let offset = i * 0.2;
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.1) {
      let r = 300 + sin(frameCount * 0.01 + a) * 20;
      let x = r * cos(a + offset);
      let z = r * sin(a + offset);
      let y = (sin(a * 2 + frameCount * 0.02) * 30) - 200;
      
      // Only draw if crack hasn't reached this point yet
      let distToCenter = sqrt(x*x + z*z);
      if (distToCenter < crackProgress * 800) {
        vertex(x, y, z);
      }
    }
    endShape(CLOSE);
  }
}

class RootSystem {
  constructor() {
    this.roots = [];
    this.generateRoots();
  }
  
  generateRoots() {
    // Create a branching root system
    for (let i = 0; i < 200; i++) {
      let root = new Root();
      this.roots.push(root);
    }
  }
  
  update() {
    for (let root of this.roots) {
      root.update();
    }
  }
  
  display() {
    stroke(180, 100, 100, 0.8);
    strokeWeight(1);
    
    // Draw all roots as wireframe
    for (let root of this.roots) {
      root.display();
    }
  }
}

class Root {
  constructor() {
    this.segments = [];
    this.length = random(50, 200);
    this.angleX = random(TWO_PI);
    this.angleY = random(TWO_PI);
    this.growth = 0;
    
    // Create initial segments
    for (let i = 0; i < 10; i++) {
      let segment = new RootSegment(i * 10, random(2, 8));
      this.segments.push(segment);
    }
  }
  
  update() {
    this.growth += 0.01;
    
    // Add new segments occasionally
    if (this.segments.length < 15 && random() < 0.02) {
      let lastSegment = this.segments[this.segments.length - 1];
      let segment = new RootSegment(lastSegment.length + 10, random(2, 8));
      this.segments.push(segment);
    }
    
    // Update all segments
    for (let segment of this.segments) {
      segment.update();
    }
  }
  
  display() {
    beginShape(LINES);
    for (let segment of this.segments) {
      let pos = segment.getPosition(this.growth);
      vertex(pos.x, pos.y, pos.z);
    }
    endShape();
  }
}

class RootSegment {
  constructor(length, size) {
    this.length = length;
    this.size = size;
    this.offsetX = random(-10, 10);
    this.offsetY = random(-10, 10);
    this.offsetZ = random(-10, 10);
  }
  
  update() {
    // Organic movement
    this.offsetX += random(-0.5, 0.5);
    this.offsetY += random(-0.5, 0.5);
    this.offsetZ += random(-0.5, 0.5);
  }
  
  getPosition(growth) {
    let x = sin(this.length * 0.1 + growth * 0.3) * 20 + this.offsetX;
    let y = -this.length + growth * 50;
    let z = cos(this.length * 0.1 + growth * 0.3) * 20 + this.offsetZ;
    
    return {x, y, z};
  }
}

function mousePressed() {
  isDragging = true;
  lastMouseX = mouseX;
  lastMouseY = mouseY;
}

function mouseDragged() {
  if (isDragging) {
    let deltaX = mouseX - lastMouseX;
    let deltaY = mouseY - lastMouseY;
    
    cameraAngleX += deltaX * 0.01;
    cameraAngleY += deltaY * 0.01;
    
    // Clamp vertical angle to prevent flipping
    cameraAngleY = constrain(cameraAngleY, -PI/2 + 0.01, PI/2 - 0.01);
    
    lastMouseX = mouseX;
    lastMouseY = mouseY;
  }
}

function mouseReleased() {
  isDragging = false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
