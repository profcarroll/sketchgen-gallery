let structures = [];
let maxStructures = 300;
let palette;

class Structure {
  constructor(x, y, z) {
    this.pos = createVector(x, y, z);
    this.size = random(15, 40);
    this.segments = [];
    this.buildSegments();
    this.color = random(palette);
  }

  buildSegments() {
    let numSegments = floor(random(3, 6));
    for (let i = 0; i < numSegments; i++) {
      let angle = random(TWO_PI);
      let length = random(15, 40);
      let segment = createVector(
        cos(angle) * length,
        sin(angle) * length,
        random(-8, 8)
      );
      this.segments.push(segment);
    }
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    
    stroke(this.color);
    strokeWeight(0.5);
    noFill();
    
    beginShape();
    for (let i = 0; i < this.segments.length; i++) {
      let seg = this.segments[i];
      vertex(seg.x, seg.y, seg.z);
    }
    endShape(CLOSE);
    
    pop();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Rusty red and pale ivory palette
  palette = [
    color(0, 80, 50),   // Rusty red
    color(0, 70, 40),
    color(10, 60, 30),
    color(20, 50, 20),
    color(30, 40, 15),
    color(15, 30, 10),
    color(35, 20, 8),
    color(40, 10, 5),   // Dark red
    color(60, 10, 90),  // Pale ivory
    color(55, 5, 95),
    color(50, 3, 98)
  ];
  
  // Generate initial structures
  for (let i = 0; i < maxStructures; i++) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let z = random(-300, -100);
    structures.push(new Structure(x, y, z));
  }
}

function draw() {
  background(0, 0, 5, 25);
  
  // Static camera
  camera(0, 0, (height/2) / tan(PI/6), 0, 0, 0, 0, 1, 0);
  
  // Display structures
  for (let i = 0; i < structures.length; i++) {
    let s = structures[i];
    s.display();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
