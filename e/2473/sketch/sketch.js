let structures = [];
let maxStructures = 500;
let palette;

class Structure {
  constructor(x, y, z) {
    this.pos = createVector(x, y, z);
    this.size = random(10, 30);
    this.segments = [];
    this.buildSegments();
    this.color = random(palette);
    this.decay = random(0.95, 0.99);
    this.age = 0;
  }

  buildSegments() {
    let numSegments = floor(random(4, 8));
    for (let i = 0; i < numSegments; i++) {
      let angle = random(TWO_PI);
      let length = random(10, 30);
      let segment = createVector(
        cos(angle) * length,
        sin(angle) * length,
        random(-5, 5)
      );
      this.segments.push(segment);
    }
  }

  update() {
    this.age++;
    // Slowly decay the structure
    for (let i = 0; i < this.segments.length; i++) {
      let seg = this.segments[i];
      seg.mult(this.decay);
      
      // Add subtle movement to segments
      seg.x += random(-0.1, 0.1);
      seg.y += random(-0.1, 0.1);
      seg.z += random(-0.05, 0.05);
    }
    
    // Occasionally remove segments to simulate erosion
    if (random() < 0.001 && this.segments.length > 2) {
      let index = floor(random(this.segments.length));
      this.segments.splice(index, 1);
    }
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    
    stroke(this.color);
    strokeWeight(0.3);
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
  
  // Muted browns and deep greens palette
  palette = [
    color(20, 40, 25),   // Deep brown
    color(25, 35, 20),
    color(30, 30, 15),
    color(35, 25, 10),
    color(40, 20, 8),
    color(45, 15, 6),
    color(50, 10, 5),
    color(60, 15, 15),   // Dark green
    color(65, 20, 10),
    color(70, 25, 8),
    color(75, 30, 5),
    color(80, 35, 3),
    color(85, 40, 2),
    color(90, 45, 1)
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
  
  // Update and display structures
  for (let i = 0; i < structures.length; i++) {
    let s = structures[i];
    s.update();
    s.display();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
