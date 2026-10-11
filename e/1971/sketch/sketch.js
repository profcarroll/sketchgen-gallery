let gears = [];
let pipes = [];
let time = 0;

class Gear {
  constructor(x, y, z, radius, teeth) {
    this.pos = createVector(x, y, z);
    this.radius = radius;
    this.teeth = teeth;
    this.rotation = random(TWO_PI);
    this.rotationSpeed = random(-0.01, 0.01);
    this.color = color(180, 160, 120, 255);
    this.highlightColor = color(220, 200, 160, 255);
  }

  update() {
    this.rotation += this.rotationSpeed;
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    
    // Gear body
    fill(this.color);
    stroke(100);
    strokeWeight(1);
    sphere(this.radius, 16, 8);
    
    // Gear teeth
    noFill();
    stroke(150);
    strokeWeight(1);
    for (let i = 0; i < this.teeth; i++) {
      const angle = map(i, 0, this.teeth, 0, TWO_PI) + this.rotation;
      const x1 = cos(angle) * (this.radius - 5);
      const y1 = sin(angle) * (this.radius - 5);
      const x2 = cos(angle) * (this.radius + 5);
      const y2 = sin(angle) * (this.radius + 5);
      
      line(x1, y1, x2, y2);
    }
    
    // Highlight
    fill(this.highlightColor);
    noStroke();
    sphere(this.radius * 0.7, 8, 4);
    
    pop();
  }
}

class Pipe {
  constructor(x, y, z, length) {
    this.pos = createVector(x, y, z);
    this.length = length;
    this.color = color(160, 140, 100, 255);
    this.highlightColor = color(200, 180, 140, 255);
    this.wavePhase = random(TWO_PI);
    this.waveSpeed = random(0.01, 0.03);
  }

  update() {
    this.wavePhase += this.waveSpeed;
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    
    // Pipe body
    fill(this.color);
    stroke(80);
    strokeWeight(1);
    cylinder(5, 4, false);
    
    // Pipe highlights
    fill(this.highlightColor);
    noStroke();
    sphere(3, 6, 4);
    
    pop();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  // Create gears
  for (let i = 0; i < 20; i++) {
    const x = random(-width/3, width/3);
    const y = random(-height/3, height/3);
    const z = random(-50, 50);
    const radius = random(20, 60);
    const teeth = floor(random(12, 24));
    gears.push(new Gear(x, y, z, radius, teeth));
  }
  
  // Create pipes
  for (let i = 0; i < 30; i++) {
    const x = random(-width/2, width/2);
    const y = random(-height/2, height/2);
    const z = random(-50, 50);
    const length = random(100, 300);
    pipes.push(new Pipe(x, y, z, length));
  }
  
  frameRate(30);
}

function draw() {
  background(30, 40, 50);
  time += 0.01;
  
  // Ambient lighting
  ambientLight(60);
  pointLight(255, 255, 255, 0, -height/2, 0);
  pointLight(200, 200, 255, 0, height/2, 0);
  
  // Move camera
  const camX = sin(time * 0.1) * 300;
  const camY = cos(time * 0.1) * 100;
  const camZ = 400 + sin(time * 0.05) * 100;
  camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);
  
  // Update and display gears
  for (let gear of gears) {
    gear.update();
    gear.display();
  }
  
  // Update and display pipes
  for (let pipe of pipes) {
    pipe.update();
    pipe.display();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
