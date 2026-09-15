let fire;
let splines = [];
let rotation = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  // Create a central rotating cube with fire effect
  fire = new Fire();
  
  // Create several orbital splines
  for (let i = 0; i < 5; i++) {
    splines.push(new Spline(i * TWO_PI / 5));
  }
}

function draw() {
  background(0);
  
  // Rotate the entire scene
  rotation += 0.002;
  rotateY(rotation);
  
  // Draw the central fire cube
  fire.display();
  
  // Draw orbital splines
  for (let spline of splines) {
    spline.update();
    spline.display();
  }
}

class Fire {
  constructor() {
    this.size = 100;
    this.segments = 8;
    this.points = [];
    
    // Generate points for the fire cube
    for (let i = 0; i < this.segments; i++) {
      let angle = map(i, 0, this.segments, 0, TWO_PI);
      let x = cos(angle) * this.size / 2;
      let y = sin(angle) * this.size / 2;
      this.points.push(createVector(x, y, 0));
    }
  }
  
  display() {
    push();
    noStroke();
    
    // Draw the cube
    fill(255, 100, 0, 100);
    box(this.size);
    
    // Add fire effect
    for (let i = 0; i < this.points.length; i++) {
      let p1 = this.points[i];
      let p2 = this.points[(i + 1) % this.points.length];
      
      // Create glowing fire lines
      stroke(255, 50, 0);
      strokeWeight(3);
      line(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
    }
    
    pop();
  }
}

class Spline {
  constructor(angleOffset) {
    this.angleOffset = angleOffset;
    this.radius = 200;
    this.segments = 30;
    this.points = [];
    this.color = color(0, 150, 0, 200); // Emerald green
    this.path = [];
    
    // Create a curved path for the spline
    for (let i = 0; i < this.segments; i++) {
      let angle = map(i, 0, this.segments, 0, TWO_PI);
      let x = cos(angle + this.angleOffset) * this.radius;
      let y = sin(angle + this.angleOffset) * this.radius;
      let z = sin(angle * 2) * 50; // Add some vertical curvature
      this.path.push(createVector(x, y, z));
    }
  }
  
  update() {
    // Update the spline's rotation around the center
    this.angleOffset += 0.001;
  }
  
  display() {
    push();
    
    stroke(this.color);
    noFill();
    strokeWeight(2);
    
    beginShape();
    for (let p of this.path) {
      vertex(p.x, p.y, p.z);
    }
    endShape(CLOSE);
    
    pop();
  }
}
