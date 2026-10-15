let coralStructures = [];
let time = 0;
let zoom = 1;
let offsetX = 0;
let offsetY = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  // Initialize coral structures with fractal-like patterns
  for (let i = 0; i < 200; i++) {
    const x = random(width);
    const y = random(height);
    const size = random(10, 50);
    const depth = random(3, 6);
    coralStructures.push(new CoralStructure(x, y, size, depth));
  }
}

function draw() {
  background(0);
  time += 0.005;
  
  // Apply zoom and pan transformations
  push();
  translate(width/2 + offsetX, height/2 + offsetY);
  scale(zoom);
  
  // Draw all coral structures
  for (let structure of coralStructures) {
    structure.update(time);
    structure.display();
  }
  
  pop();
}

class CoralStructure {
  constructor(x, y, size, depth) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.depth = depth;
    this.segments = [];
    this.initSegments();
  }
  
  initSegments() {
    this.segments = [];
    const numSegments = floor(random(3, 7));
    for (let i = 0; i < numSegments; i++) {
      const angle = random(TWO_PI);
      const length = random(this.size * 0.5, this.size * 1.5);
      this.segments.push({
        angle: angle,
        length: length,
        depth: floor(random(2, 5))
      });
    }
  }
  
  update(time) {
    // Pulsing effect
    for (let segment of this.segments) {
      segment.length = this.size * 0.5 + sin(time * 0.5 + segment.angle) * this.size * 0.3;
    }
  }
  
  display() {
    push();
    translate(this.x, this.y);
    
    // Draw each segment as a glowing translucent polygon
    for (let i = 0; i < this.segments.length; i++) {
      const seg = this.segments[i];
      const nextSeg = this.segments[(i + 1) % this.segments.length];
      
      // Calculate points for the polygon
      const p1 = createVector(0, 0);
      const p2 = p5.Vector.fromAngle(seg.angle).mult(seg.length);
      const p3 = p5.Vector.fromAngle(nextSeg.angle).mult(nextSeg.length);
      
      // Create a color with saturation and brightness
      const hue = (i * 60 + time * 20) % 360;
      fill(hue, 80, 90, 150);
      
      beginShape();
      vertex(p1.x, p1.y);
      vertex(p2.x, p2.y);
      vertex(p3.x, p3.y);
      endShape(CLOSE);
    }
    
    pop();
  }
}

function mousePressed() {
  // Start zooming into the fractal
  zoom *= 1.5;
}

function mouseDragged() {
  // Pan around the fractal
  offsetX -= (pmouseX - mouseX) / zoom;
  offsetY -= (pmouseY - mouseY) / zoom;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
