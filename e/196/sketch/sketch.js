let tendrils = [];
const numTendrils = 200;
const maxDepth = 150;
let baseStructure;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Create the central structure
  baseStructure = createGraphics(200, 200);
  baseStructure.colorMode(HSB, 360, 100, 100, 1);
  baseStructure.noStroke();
  baseStructure.fill(200, 80, 80, 0.8);
  baseStructure.rectMode(CENTER);
  baseStructure.rect(0, 0, 100, 100);
  
  // Initialize tendrils
  for (let i = 0; i < numTendrils; i++) {
    tendrils.push(new Tendril(i));
  }
}

function draw() {
  background(0, 0, 0, 0.05);
  
  // Center the view
  translate(-width/2, -height/2);
  
  // Draw base structure
  push();
  translate(width/2, height/2, 0);
  rotateX(frameCount * 0.005);
  rotateY(frameCount * 0.003);
  texture(baseStructure);
  plane(100, 100);
  pop();
  
  // Update and display tendrils
  for (let t of tendrils) {
    t.update();
    t.display();
  }
}

class Tendril {
  constructor(id) {
    this.id = id;
    this.reset();
  }
  
  reset() {
    this.pos = createVector(0, 0, 0);
    this.segments = [];
    this.depth = 0;
    this.growth = random(0.5, 1.5);
    this.hue = (this.id * 37) % 360;
    this.alpha = random(0.2, 0.8);
    this.maxDepth = random(100, maxDepth);
    this.angle = random(TWO_PI);
    this.vel = p5.Vector.random3D().mult(random(0.5, 2));
  }
  
  update() {
    if (this.depth > this.maxDepth) {
      this.reset();
      return;
    }
    
    // Move the tendril
    this.pos.add(this.vel);
    
    // Add new segment
    this.segments.push(this.pos.copy());
    if (this.segments.length > 20) {
      this.segments.shift();
    }
    
    // Occasionally change direction
    if (random() < 0.05) {
      this.vel.rotate(random(-0.1, 0.1));
    }
    
    this.depth++;
    
    // Mouse interaction
    let mouseDist = dist(mouseX - width/2, mouseY - height/2, this.pos.x, this.pos.y);
    if (mouseDist < 300) {
      let force = p5.Vector.sub(this.pos, createVector(mouseX - width/2, mouseY - height/2));
      force.normalize();
      force.mult(0.1);
      this.vel.add(force);
    }
    
    // Keep tendrils in bounds
    if (abs(this.pos.x) > width/2 + 200 || abs(this.pos.y) > height/2 + 200) {
      this.reset();
    }
  }
  
  display() {
    push();
    
    // Draw segments as a line
    beginShape(LINES);
    for (let i = 0; i < this.segments.length - 1; i++) {
      let seg = this.segments[i];
      let nextSeg = this.segments[i + 1];
      
      // Fade out towards the end
      let alpha = map(i, 0, this.segments.length, this.alpha, 0.05);
      
      stroke(this.hue, 80, 90, alpha);
      vertex(seg.x, seg.y, seg.z);
      vertex(nextSeg.x, nextSeg.y, nextSeg.z);
    }
    endShape();
    
    // Draw head
    if (this.segments.length > 0) {
      let head = this.segments[this.segments.length - 1];
      fill(this.hue, 90, 95, 0.8);
      noStroke();
      sphere(3);
    }
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
