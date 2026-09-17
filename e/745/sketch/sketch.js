let particles1 = [];
let particles2 = [];
let flowField;
let noiseScale = 0.02;
let noiseStrength = 0.5;
let pulsePhase = 0;

class Particle {
  constructor(x, y, color) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.color = color;
    this.size = random(2, 6);
    this.maxSpeed = random(1, 3);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  display() {
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.size);
  }

  checkEdges() {
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y > height) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = height;
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);

  // Create two streams of particles
  for (let i = 0; i < 200; i++) {
    particles1.push(new Particle(random(width/4), random(height), color(200, 80, 90)));
    particles2.push(new Particle(random(width*3/4, width), random(height), color(300, 80, 90)));
  }

  // Initialize flow field
  flowField = new Array(width * height).fill(0);
}

function draw() {
  background(0, 0, 10);

  pulsePhase += 0.02;

  // Update and display particles
  for (let i = 0; i < particles1.length; i++) {
    let p1 = particles1[i];
    
    // Flow field force
    let n = noise(p1.pos.x * noiseScale, p1.pos.y * noiseScale, pulsePhase);
    let angle = map(n, 0, 1, 0, TWO_PI * 2);
    let force = p5.Vector.fromAngle(angle);
    force.mult(noiseStrength);
    
    p1.applyForce(force);
    p1.update();
    p1.checkEdges();
    p1.display();
  }

  for (let i = 0; i < particles2.length; i++) {
    let p2 = particles2[i];
    
    // Flow field force with different phase
    let n = noise(p2.pos.x * noiseScale, p2.pos.y * noiseScale, pulsePhase + 10);
    let angle = map(n, 0, 1, 0, TWO_PI * 2);
    let force = p5.Vector.fromAngle(angle);
    force.mult(noiseStrength);
    
    p2.applyForce(force);
    p2.update();
    p2.checkEdges();
    p2.display();
  }

  // Pulsing effect for one stream
  let pulse = sin(pulsePhase * 2) * 0.3 + 0.7;
  for (let i = 0; i < particles1.length; i++) {
    particles1[i].size = map(pulse, 0, 1, 2, 8);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
