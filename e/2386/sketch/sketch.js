let chambers = [];
let accretions = [];
let cameraAngle = 0;
let tidePhase = 0;

class Chamber {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.radius = random(80, 150);
    this.segments = int(random(8, 16));
    this.color = color(240, 240, 245, 180);
  }

  display() {
    push();
    translate(this.x, this.y, this.z);
    
    noStroke();
    fill(this.color);
    
    beginShape(QUADS);
    for (let i = 0; i < this.segments; i++) {
      let angle1 = map(i, 0, this.segments, 0, TWO_PI);
      let angle2 = map(i + 1, 0, this.segments, 0, TWO_PI);
      
      let x1 = cos(angle1) * this.radius;
      let y1 = sin(angle1) * this.radius;
      let x2 = cos(angle2) * this.radius;
      let y2 = sin(angle2) * this.radius;
      
      vertex(x1, y1, 0);
      vertex(x2, y2, 0);
      vertex(x2, y2, -this.radius * 0.3);
      vertex(x1, y1, -this.radius * 0.3);
    }
    endShape();
    
    pop();
  }
}

class Accretion {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.baseSize = random(5, 15);
    this.size = this.baseSize;
    this.growthRate = random(0.02, 0.08);
    this.pulsePhase = random(TWO_PI);
    this.color = color(255, 255, 255, 200);
    this.growthDirection = random(1) > 0.5 ? 1 : -1;
  }

  update() {
    this.pulsePhase += this.growthRate * this.growthDirection;
    let pulse = sin(this.pulsePhase);
    this.size = this.baseSize + pulse * this.baseSize * 0.3;
  }

  display() {
    push();
    translate(this.x, this.y, this.z);
    
    noStroke();
    fill(this.color);
    
    sphere(this.size, 6, 4);
    
    pop();
  }
}

function setup() {
  createCanvas(800, 600, WEBGL);
  
  // Create chambers
  for (let i = 0; i < 15; i++) {
    let x = random(-width/2 + 100, width/2 - 100);
    let y = random(-height/2 + 100, height/2 - 100);
    let z = random(-300, -100);
    chambers.push(new Chamber(x, y, z));
  }
  
  // Create accretions
  for (let i = 0; i < 80; i++) {
    let x = random(-width/2 + 50, width/2 - 50);
    let y = random(-height/2 + 50, height/2 - 50);
    let z = random(-300, -100);
    accretions.push(new Accretion(x, y, z));
  }
  
  frameRate(30);
}

function draw() {
  background(10, 10, 20);
  
  // Update tide phase for pulsing effect
  tidePhase += 0.01;
  
  // Rotate camera based on mouse position
  cameraAngle = map(mouseX, 0, width, 0, TWO_PI);
  let camX = sin(cameraAngle) * 500;
  let camZ = cos(cameraAngle) * 500;
  camera(camX, 0, camZ, 0, 0, 0, 0, 1, 0);
  
  // Lighting
  pointLight(255, 255, 255, -width/2, -height/2, 200);
  pointLight(200, 200, 200, width/2, height/2, -200);
  ambientLight(40, 40, 50);
  
  // Draw chambers
  for (let chamber of chambers) {
    chamber.display();
  }
  
  // Update and draw accretions
  for (let accretion of accretions) {
    accretion.update();
    accretion.display();
  }
}
