let filaments = [];
let substrate;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  substrate = createGraphics(width, height);
  substrate.background(50, 60, 70);
  for (let i = 0; i < 100; i++) {
    filaments.push(new Filament());
  }
}

function draw() {
  background(20);
  time += 0.01;
  
  // Camera movement
  let cx = sin(time * 0.3) * 200;
  let cy = cos(time * 0.2) * 100;
  let cz = sin(time * 0.1) * 150;
  camera(cx, cy, cz + 500, cx, cy, 0, 0, 1, 0);
  
  // Draw substrate
  push();
  texture(substrate);
  plane(width, height);
  pop();
  
  // Update and draw filaments
  for (let f of filaments) {
    f.update();
    f.display();
  }
}

class Filament {
  constructor() {
    this.points = [];
    this.length = 100;
    this.growthRate = random(0.5, 2);
    this.color = color(random(100, 255), random(100, 200), random(150, 255), 200);
    this.startX = random(-width/3, width/3);
    this.startY = random(-height/3, height/3);
    this.startZ = random(-100, 100);
    this.points.push(createVector(this.startX, this.startY, this.startZ));
  }
  
  update() {
    if (this.points.length < this.length) {
      let last = this.points[this.points.length - 1];
      let next = createVector(
        last.x + random(-2, 2),
        last.y + random(-2, 2),
        last.z + random(-1, 1)
      );
      this.points.push(next);
    } else {
      // Remove oldest point and add new one
      this.points.shift();
      let last = this.points[this.points.length - 1];
      let next = createVector(
        last.x + random(-2, 2),
        last.y + random(-2, 2),
        last.z + random(-1, 1)
      );
      this.points.push(next);
    }
  }
  
  display() {
    noFill();
    stroke(this.color);
    strokeWeight(0.5);
    
    beginShape();
    for (let p of this.points) {
      vertex(p.x, p.y, p.z);
    }
    endShape();
  }
}
