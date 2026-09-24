let particles = [];
const numParticles = 1000;
let connections = [];
let colorPalette = [];
let bgColor;
let mouseForce = { x: 0, y: 0 };
let dragForce = { x: 0, y: 0 };
let trail = [];
let points = [];

class Particle {
  constructor() {
    this.pos = createVector(
      random(-width, width),
      random(-height, height),
      random(-100, 100)
    );
    this.vel = createVector(random(-0.5, 0.5), random(-0.5, 0.5), random(-0.5, 0.5));
    this.acc = createVector(0, 0, 0);
    this.size = random(1, 3);
    this.color = color(random(100, 255), random(100, 255), random(100, 255));
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);

    // Apply mouse force
    if (mouseForce.x !== 0 || mouseForce.y !== 0) {
      let force = p5.Vector.sub(this.pos, createVector(mouseForce.x, mouseForce.y, 0));
      force.normalize();
      force.mult(0.1);
      this.acc.add(force);
    }

    // Apply drag force
    if (dragForce.x !== 0 || dragForce.y !== 0) {
      let force = p5.Vector.sub(this.pos, createVector(dragForce.x, dragForce.y, 0));
      force.normalize();
      force.mult(0.01);
      this.acc.add(force);
    }

    // Boundary check
    if (this.pos.x < -width/2 || this.pos.x > width/2) this.vel.x *= -1;
    if (this.pos.y < -height/2 || this.pos.y > height/2) this.vel.y *= -1;
    if (this.pos.z < -200 || this.pos.z > 200) this.vel.z *= -1;

    // Add to trail
    trail.push(this.pos.copy());
    if (trail.length > 50) trail.shift();
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    noStroke();
    fill(this.color);
    sphere(this.size, 3, 3); // Lower detail
    pop();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  bgColor = color(0, 0, 0);

  // Create particles
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle());
  }

  // Generate initial color palette
  for (let i = 0; i < 10; i++) {
    colorPalette.push(color(random(360), random(50, 100), random(70, 100)));
  }
}

function draw() {
  background(bgColor);

  // Reset connections
  connections = [];

  // Update and display particles
  for (let p of particles) {
    p.update();
    // Connect nearby particles (simplified spatial hash)
    for (let other of particles) {
      if (other === p) continue;
      let d = dist(p.pos.x, p.pos.y, p.pos.z, other.pos.x, other.pos.y, other.pos.z);
      if (d < 100 && connections.length < 500) { // Cap connections
        connections.push([p.pos, other.pos]);
      }
    }
  }

  // Draw connections
  stroke(255, 50);
  noFill();
  beginShape(LINES);
  for (let c of connections) {
    vertex(c[0].x, c[0].y, c[0].z);
    vertex(c[1].x, c[1].y, c[1].z);
  }
  endShape();

  // Draw particles as points to avoid sphere() per particle
  noStroke();
  fill(255);
  beginShape(POINTS);
  for (let p of particles) {
    vertex(p.pos.x, p.pos.y, p.pos.z);
  }
  endShape();

  // Draw trail
  noFill();
  stroke(255, 100);
  beginShape(LINES);
  for (let i = 0; i < trail.length - 1; i++) {
    vertex(trail[i].x, trail[i].y, trail[i].z);
    vertex(trail[i+1].x, trail[i+1].y, trail[i+1].z);
  }
  endShape();

  // Reset forces
  mouseForce = { x: 0, y: 0 };
  dragForce = { x: 0, y: 0 };
}

function mousePressed() {
  mouseForce.x = mouseX - width/2;
  mouseForce.y = mouseY - height/2;

  // Change color palette on click
  colorPalette = [];
  for (let i = 0; i < 10; i++) {
    colorPalette.push(color(random(360), random(50, 100), random(70, 100)));
  }
}

function mouseDragged() {
  dragForce.x = mouseX - width/2;
  dragForce.y = mouseY - height/2;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
