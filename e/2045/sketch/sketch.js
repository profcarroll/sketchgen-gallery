let particles = [];
let bonds = [];
let cameraAngleX = 0;
let cameraAngleY = 0;
let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;
let lattice1 = [];
let lattice2 = [];
let lattice3 = [];

class Particle {
  constructor(x, y, z, color) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.color = color;
    this.originalX = x;
    this.originalY = y;
    this.originalZ = z;
  }
  
  draw() {
    push();
    translate(this.x, this.y, this.z);
    noStroke();
    fill(this.color);
    sphere(1.5, 6, 4);
    pop();
  }
}

class Bond {
  constructor(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
  }
  
  draw() {
    stroke(red(this.p1.color), green(this.p1.color), blue(this.p1.color), 100);
    strokeWeight(1);
    line(this.p1.x, this.p1.y, this.p1.z, this.p2.x, this.p2.y, this.p2.z);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noLoop();
  
  // Create three distinct crystal lattices
  for (let i = 0; i < 30; i++) {
    let x1 = random(-80, 80);
    let y1 = random(-80, 80);
    let z1 = random(-40, 40);
    
    let x2 = random(-80, 80);
    let y2 = random(-80, 80);
    let z2 = random(-40, 40);
    
    let x3 = random(-80, 80);
    let y3 = random(-80, 80);
    let z3 = random(-40, 40);
    
    // Lattice 1 - red
    lattice1.push(new Particle(x1, y1, z1, color(255, 50, 50, 150)));
    // Lattice 2 - green  
    lattice2.push(new Particle(x2, y2, z2, color(50, 255, 50, 150)));
    // Lattice 3 - blue
    lattice3.push(new Particle(x3, y3, z3, color(50, 50, 255, 150)));
  }
  
  // Combine all particles
  particles = [...lattice1, ...lattice2, ...lattice3];
  
  // Create bonds between nearby particles from different lattices
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let p1 = particles[i];
      let p2 = particles[j];
      
      let d = dist(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
      
      // Only bond particles that are close enough and from different lattices
      if (d < 30 && (i < 30 || j < 30 || (i >= 30 && i < 60) || (j >= 30 && j < 60) || (i >= 60) || (j >= 60))) {
        bonds.push(new Bond(p1, p2));
      }
    }
  }
}

function draw() {
  background(10);
  
  // Camera controls
  cameraAngleX += (mouseY - lastMouseY) * 0.01;
  cameraAngleY += (mouseX - lastMouseX) * 0.01;
  
  // Apply camera rotation
  rotateX(cameraAngleX);
  rotateY(cameraAngleY);
  
  // Draw bonds first (behind particles)
  for (let bond of bonds) {
    bond.draw();
  }
  
  // Draw particles
  for (let particle of particles) {
    particle.draw();
  }
}

function mousePressed() {
  isDragging = true;
  lastMouseX = mouseX;
  lastMouseY = mouseY;
}

function mouseDragged() {
  if (isDragging) {
    lastMouseX = mouseX;
    lastMouseY = mouseY;
    redraw();
  }
}

function mouseReleased() {
  isDragging = false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
