let obsidianSurface;
let waxLayers = [];
let sedimentParticles = [];
let ridges = [];

class Ridge {
  constructor(x, y, z, size) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.size = size;
    this.growth = random(0.001, 0.003);
    this.angle = random(TWO_PI);
  }

  update() {
    this.angle += this.growth;
  }

  display() {
    push();
    translate(this.x, this.y, this.z);
    rotateX(this.angle);
    rotateY(this.angle * 0.7);
    noStroke();
    fill(30, 35, 40, 200);
    sphere(this.size, 6, 4);
    pop();
  }
}

class WaxLayer {
  constructor(y, opacity) {
    this.y = y;
    this.opacity = opacity;
    this.waveOffset = random(1000);
    this.waveSpeed = random(0.001, 0.003);
  }

  update() {
    this.waveOffset += this.waveSpeed;
  }

  display() {
    push();
    translate(0, this.y, 0);
    noStroke();
    fill(255, 200, 50, this.opacity);
    beginShape();
    for (let i = 0; i <= 100; i++) {
      let x = map(i, 0, 100, 0, width);
      let y = sin(x * 0.02 + this.waveOffset) * 5;
      vertex(x, y, 0);
    }
    endShape(CLOSE);
    pop();
  }
}

class SedimentParticle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = random(width);
    this.y = random(-20, -5);
    this.z = random(-50, 50);
    this.size = random(0.2, 1);
    this.speed = random(0.05, 0.2);
    this.opacity = random(10, 30);
    this.wobble = random(TWO_PI);
    this.wobbleSpeed = random(0.01, 0.02);
  }

  update() {
    this.y += this.speed;
    this.x += sin(this.wobble) * 0.1;
    this.wobble += this.wobbleSpeed;
    
    if (this.y > height + 10) {
      this.reset();
    }
  }

  display() {
    push();
    translate(this.x, this.y, this.z);
    noStroke();
    fill(180, 160, 120, this.opacity);
    sphere(this.size, 3, 2);
    pop();
  }
}

function setup() {
  createCanvas(800, 600, WEBGL);
  
  // Create ridges
  for (let i = 0; i < 20; i++) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let z = random(-100, -50);
    let size = random(10, 40);
    ridges.push(new Ridge(x, y, z, size));
  }
  
  // Create wax layers
  for (let i = 0; i < 3; i++) {
    let y = map(i, 0, 2, -height/4, height/4);
    let opacity = random(80, 120);
    waxLayers.push(new WaxLayer(y, opacity));
  }
  
  // Create sediment particles
  for (let i = 0; i < 300; i++) {
    sedimentParticles.push(new SedimentParticle());
  }
}

function draw() {
  background(10, 15, 20);
  
  // Create lighting
  pointLight(255, 255, 255, 0, -height/2, 0);
  pointLight(200, 200, 200, 0, height/2, 0);
  
  // Draw ridges
  for (let ridge of ridges) {
    ridge.update();
    ridge.display();
  }
  
  // Draw wax layers
  for (let layer of waxLayers) {
    layer.update();
    layer.display();
  }
  
  // Draw sediment particles
  for (let particle of sedimentParticles) {
    particle.update();
    particle.display();
  }
}
