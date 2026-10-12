let structures = [];
let stressFractures = [];

class CrystalStructure {
  constructor(x, y, z) {
    this.pos = createVector(x, y, z);
    this.size = random(30, 80);
    this.rotation = createVector(random(TWO_PI), random(TWO_PI), random(TWO_PI));
    this.rotationSpeed = createVector(
      random(-0.005, 0.005),
      random(-0.005, 0.005),
      random(-0.005, 0.005)
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
    
    // Create initial crystal geometry
    this.createCrystal();
  }
  
  createCrystal() {
    // Generate stress fracture points
    for (let i = 0; i < 8; i++) {
      let angle = random(TWO_PI);
      let dist = random(0.3, 0.8) * this.size;
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
      this.stress += random(0.0005, 0.002);
    } else {
      this.stress = 0;
      this.maxStress = random(0.3, 1);
      // Create new fracture points when stress resets
      this.fracturePoints = [];
      for (let i = 0; i < 8; i++) {
        let angle = random(TWO_PI);
        let dist = random(0.3, 0.8) * this.size;
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
    
    // Draw main crystal structure
    noStroke();
    fill(red(this.color), green(this.color), blue(this.color), 150);
    
    // Create a complex geometric form
    beginShape();
    for (let i = 0; i < 8; i++) {
      let angle = map(i, 0, 8, 0, TWO_PI);
      let x = cos(angle) * this.size;
      let y = sin(angle) * this.size;
      vertex(x, y, 0);
    }
    endShape(CLOSE);
    
    // Draw stress fracture lines
    stroke(255, 255, 255, 100 + this.stress * 100);
    strokeWeight(1 + this.stress * 2);
    noFill();
    beginShape();
    for (let i = 0; i < this.fracturePoints.length; i++) {
      let p = this.fracturePoints[i];
      vertex(p.x, p.y, 0);
    }
    endShape(CLOSE);
    
    // Draw reflective shards
    stroke(255, 255, 255, 100 + this.stress * 50);
    strokeWeight(0.5);
    for (let i = 0; i < 6; i++) {
      let angle = random(TWO_PI);
      let length = random(5, 15);
      let x1 = cos(angle) * this.size * 0.8;
      let y1 = sin(angle) * this.size * 0.8;
      let x2 = x1 + cos(angle) * length;
      let y2 = y1 + sin(angle) * length;
      line(x1, y1, 0, x2, y2, 0);
    }
    
    pop();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  frameRate(30);
  
  // Create initial crystal structures
  for (let i = 0; i < 12; i++) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let z = random(-400, 400);
    structures.push(new CrystalStructure(x, y, z));
  }
}

function draw() {
  background(15, 20, 25);
  
  // Add lighting
  pointLight(180, 200, 220, 0, -300, 300);
  pointLight(100, 120, 150, 0, 300, 300);
  ambientLight(20, 25, 30);
  
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
    if (random() < 0.002 && structures.length < 20) {
      let x = random(-width/2, width/2);
      let y = random(-height/2, height/2);
      let z = random(-400, 400);
      structures.push(new CrystalStructure(x, y, z));
    }
  }
  
  // Remove old structures
  if (structures.length > 20) {
    structures.shift();
  }
}
