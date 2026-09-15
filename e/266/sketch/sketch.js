let splines = [];
let core;
let numSplines = 12;
let time = 0;

function setup() {
  createCanvas(600, 600, WEBGL);
  core = new Core();
  for (let i = 0; i < numSplines; i++) {
    splines.push(new Spline(i));
  }
}

function draw() {
  background(20);
  time += 0.005;
  
  // Rotate the entire scene
  rotateY(time * 0.1);
  
  core.update();
  core.display();
  
  for (let s of splines) {
    s.update();
    s.display();
  }
}

class Core {
  constructor() {
    this.radius = 100;
    this.rotation = 0;
    this.segments = 32;
  }
  
  update() {
    this.rotation += 0.01;
  }
  
  display() {
    push();
    rotateX(this.rotation);
    rotateZ(this.rotation * 0.5);
    
    noStroke();
    fill(200, 80, 0); // Copper tone
    
    for (let i = 0; i < this.segments; i++) {
      let a1 = map(i, 0, this.segments, 0, TWO_PI);
      let a2 = map(i + 1, 0, this.segments, 0, TWO_PI);
      
      beginShape(QUAD_STRIP);
      vertex(
        cos(a1) * this.radius,
        sin(a1) * this.radius,
        0
      );
      vertex(
        cos(a1) * (this.radius * 1.2),
        sin(a1) * (this.radius * 1.2),
        0
      );
      vertex(
        cos(a2) * this.radius,
        sin(a2) * this.radius,
        0
      );
      vertex(
        cos(a2) * (this.radius * 1.2),
        sin(a2) * (this.radius * 1.2),
        0
      );
      endShape();
    }
    
    pop();
  }
}

class Spline {
  constructor(id) {
    this.id = id;
    this.points = [];
    this.numPoints = 50;
    this.radius = 200 + random(50);
    this.angleOffset = random(TWO_PI);
    this.color = color(180, 70, 0); // Copper
    this.emerald = color(0, 180, 0); // Emerald green
    this.isEmerald = false;
    
    for (let i = 0; i < this.numPoints; i++) {
      let angle = map(i, 0, this.numPoints, 0, TWO_PI * 3);
      let x = cos(angle) * this.radius;
      let y = sin(angle) * this.radius;
      let z = random(-50, 50);
      this.points.push({x, y, z});
    }
  }
  
  update() {
    // Orbiting motion
    this.angleOffset += 0.01;
    
    // Occasionally switch to emerald color
    if (frameCount % 30 === 0) {
      this.isEmerald = !this.isEmerald;
    }
  }
  
  display() {
    push();
    
    rotateY(this.angleOffset);
    rotateX(0.2);
    
    strokeWeight(2);
    
    beginShape();
    for (let i = 0; i < this.points.length; i++) {
      let p = this.points[i];
      let x = p.x;
      let y = p.y;
      let z = p.z;
      
      // Add some noise to make it look more organic
      let noiseFactor = 0.5;
      x += noise(x * 0.01, y * 0.01, time) * noiseFactor;
      y += noise(y * 0.01, z * 0.01, time) * noiseFactor;
      z += noise(z * 0.01, x * 0.01, time) * noiseFactor;
      
      // Apply color based on emerald state
      let c = this.isEmerald ? this.emerald : this.color;
      stroke(c);
      
      vertex(x, y, z);
    }
    endShape(CLOSE);
    
    pop();
  }
}
