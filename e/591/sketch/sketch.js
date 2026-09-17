let splines = [];
let core;

function setup() {
  createCanvas(600, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  core = new Core();
  
  for (let i = 0; i < 8; i++) {
    splines.push(new Spline(i * TWO_PI / 8));
  }
}

function draw() {
  background(0);
  ambientLight(30);
  pointLight(255, 255, 255, 0, 0, 500);
  
  rotateX(frameCount * 0.001);
  rotateY(frameCount * 0.002);
  
  core.update();
  core.display();
  
  for (let s of splines) {
    s.update();
    s.display();
  }
}

class Core {
  constructor() {
    this.radius = 80;
    this.hue = 10;
    this.sat = 70;
    this.bri = 90;
    this.alpha = 0.9;
  }
  
  update() {
    this.hue = (this.hue + 0.2) % 360;
  }
  
  display() {
    push();
    noStroke();
    fill(this.hue, this.sat, this.bri, this.alpha);
    sphere(this.radius);
    
    // Glow effect
    for (let i = 0; i < 5; i++) {
      let alpha = map(i, 0, 4, 0.3, 0);
      fill(this.hue, this.sat, this.bri, alpha);
      sphere(this.radius + i * 5);
    }
    pop();
  }
}

class Spline {
  constructor(angle) {
    this.angle = angle;
    this.radius = 200;
    this.segments = 100;
    this.points = [];
    this.rotationSpeed = random(0.001, 0.005);
    this.hueOffset = random(360);
    
    // Generate points
    for (let i = 0; i < this.segments; i++) {
      let t = map(i, 0, this.segments - 1, 0, TWO_PI * 4);
      let x = cos(t + this.angle) * this.radius;
      let y = sin(t + this.angle) * this.radius;
      let z = sin(t * 2 + frameCount * 0.001) * 50;
      
      this.points.push(createVector(x, y, z));
    }
  }
  
  update() {
    this.angle += this.rotationSpeed;
  }
  
  display() {
    push();
    
    rotateZ(this.angle);
    
    stroke(30, 60, 80, 0.7);
    noFill();
    
    beginShape();
    for (let p of this.points) {
      vertex(p.x, p.y, p.z);
    }
    endShape(CLOSE);
    
    // Mesh effect
    stroke(20, 40, 60, 0.5);
    for (let i = 0; i < this.segments; i++) {
      let a = this.points[i];
      let b = this.points[(i + 1) % this.segments];
      line(a.x, a.y, a.z, b.x, b.y, b.z);
    }
    
    pop();
  }
}
