let structures = [];

class FracturedCrystal {
  constructor(x, y, z) {
    this.pos = createVector(x, y, z);
    this.size = random(20, 60);
    this.rotation = createVector(random(TWO_PI), random(TWO_PI), random(TWO_PI));
    this.rotationSpeed = createVector(
      random(-0.003, 0.003),
      random(-0.003, 0.003),
      random(-0.003, 0.003)
    );
    this.color = color(
      random(180, 255),
      random(150, 220),
      random(180, 255),
      180
    );
    this.stress = 0;
    this.maxStress = random(0.5, 1);
    this.fracturePoints = [];
    this.growthPhase = 0;
    
    // Create initial crystal geometry with fracturing
    this.createFracturedGeometry();
  }
  
  createFracturedGeometry() {
    // Generate fracture points for stress visualization
    for (let i = 0; i < 12; i++) {
      let angle = random(TWO_PI);
      let dist = random(0.3, 0.9) * this.size;
      this.fracturePoints.push(createVector(
        cos(angle) * dist,
        sin(angle) * dist,
        0
      ));
    }
  }
  
  update() {
    // Rotate the structure
    this.rotation.add(this.rotationSpeed);
    
    // Simulate stress buildup and release
    if (this.stress < this.maxStress) {
      this.stress += random(0.001, 0.003);
      this.growthPhase += 0.02;
    } else {
      this.stress = 0;
      this.maxStress = random(0.3, 1);
      // Create new fracture points when stress resets
      this.fracturePoints = [];
      for (let i = 0; i < 12; i++) {
        let angle = random(TWO_PI);
        let dist = random(0.3, 0.9) * this.size;
        this.fracturePoints.push(createVector(
          cos(angle) * dist,
          sin(angle) * dist,
          0
        ));
      }
    }
  }
  
  display() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    rotateX(this.rotation.x);
    rotateY(this.rotation.y);
    rotateZ(this.rotation.z);
    
    // Draw main crystal structure with subtle deformation
    noStroke();
    fill(red(this.color), green(this.color), blue(this.color), 120);
    
    beginShape();
    for (let i = 0; i < 8; i++) {
      let angle = map(i, 0, 8, 0, TWO_PI) + sin(this.growthPhase * 0.5) * 0.2;
      let x = cos(angle) * this.size * (1 + sin(this.growthPhase * 0.3) * 0.1);
      let y = sin(angle) * this.size * (1 + cos(this.growthPhase * 0.4) * 0.1);
      vertex(x, y, 0);
    }
    endShape(CLOSE);
    
    // Draw stress fracture lines
    stroke(255, 255, 255, 120 + this.stress * 80);
    strokeWeight(0.5 + this.stress * 3);
    noFill();
    beginShape();
    for (let i = 0; i < this.fracturePoints.length; i++) {
      let p = this.fracturePoints[i];
      vertex(p.x, p.y, 0);
    }
    endShape(CLOSE);
    
    // Draw glowing stress lines
    stroke(255, 255, 255, 80 + this.stress * 40);
    strokeWeight(0.2);
    for (let i = 0; i < 6; i++) {
      let angle1 = random(TWO_PI);
      let angle2 = random(TWO_PI);
      let length = random(5, 20);
      let x1 = cos(angle1) * this.size * 0.7;
      let y1 = sin(angle1) * this.size * 0.7;
      let x2 = x1 + cos(angle2) * length;
      let y2 = y1 + sin(angle2) * length;
      line(x1, y1, 0, x2, y2, 0);
    }
    
    pop();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  frameRate(30);
  
  // Create initial crystal structures
  for (let i = 0; i < 15; i++) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let z = random(-400, 400);
    structures.push(new FracturedCrystal(x, y, z));
  }
}

function draw() {
  background(10, 15, 20);
  
  // Add lighting
  pointLight(180, 200, 220, 0, -300, 300);
  pointLight(100, 120, 150, 0, 300, 300);
  ambientLight(15, 20, 25);
  
  // Camera movement for dynamic view
  let time = millis() * 0.0002;
  camera(
    sin(time) * width/3,
    sin(time*0.8) * height/4,
    cos(time) * 800,
    0, 0, 0,
    0, 1, 0
  );
  
  // Update and display structures
  for (let i = 0; i < structures.length; i++) {
    let structure = structures[i];
    structure.update();
    structure.display();
    
    // Occasionally add new structures to simulate continuous formation
    if (random() < 0.001 && structures.length < 25) {
      let x = random(-width/2, width/2);
      let y = random(-height/2, height/2);
      let z = random(-400, 400);
      structures.push(new FracturedCrystal(x, y, z));
    }
  }
  
  // Remove old structures
  if (structures.length > 25) {
    structures.shift();
  }
}
