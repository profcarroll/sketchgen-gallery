let structures = [];
let time = 0;
let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize some fungal-like structures
  for (let i = 0; i < 30; i++) {
    structures.push({
      x: random(-width/3, width/3),
      y: random(-height/3, height/3),
      z: random(-200, 200),
      size: random(15, 40),
      age: random(200),
      hue: random(180, 240), // Cool grays to aqueous blues
      saturation: random(30, 60),
      brightness: random(70, 90),
      segments: []
    });
  }
  
  // Initialize particles for flocking effect
  for (let i = 0; i < 100; i++) {
    particles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-200, 200),
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5),
      vz: random(-0.5, 0.5),
      size: random(1, 3),
      hue: random(200, 260),
      saturation: random(50, 80),
      brightness: random(70, 90)
    });
  }
}

function draw() {
  background(0);
  time += 0.01;
  
  // Tidal pulse effect
  let tide = sin(time) * 0.2 + 0.8;
  
  // Camera movement for immersive effect
  let camX = sin(time * 0.3) * 200;
  let camY = cos(time * 0.2) * 100;
  camera(camX, camY, (height/2) / tan(PI/6), 
         camX, camY, 0, 
         0, 1, 0);
  
  // Draw all structures
  for (let i = 0; i < structures.length; i++) {
    let s = structures[i];
    
    push();
    
    // Position
    translate(s.x, s.y, s.z);
    
    // Tidal growth/erosion
    let pulse = sin(s.age + time * 2) * 0.5 + 0.5;
    let scale = s.size * (0.8 + pulse * 0.4);
    
    // Color based on position and time
    let hue = (s.hue + time * 10) % 360;
    fill(hue, s.saturation, s.brightness, 0.8);
    noStroke();
    
    // Create a fungal-like structure
    drawFungalStructure(scale);
    
    pop();
    
    // Update age for next frame
    s.age += 0.2;
  }
  
  // Add new structures occasionally
  if (frameCount % 60 === 0 && structures.length < 100) {
    structures.push({
      x: random(-width/3, width/3),
      y: random(-height/3, height/3),
      z: random(-200, 200),
      size: random(15, 40),
      age: 0,
      hue: random(180, 240),
      saturation: random(30, 60),
      brightness: random(70, 90),
      segments: []
    });
  }
  
  // Remove old structures that have aged too much
  for (let i = structures.length - 1; i >= 0; i--) {
    if (structures[i].age > 500) {
      structures.splice(i, 1);
    }
  }
  
  // Update and draw particles
  updateParticles();
  drawParticles();
}

function updateParticles() {
  for (let p of particles) {
    // Apply simple flocking rules
    let sep = separate(p); // Separation
    let ali = align(p);     // Alignment
    let coh = cohesion(p);  // Cohesion
    
    // Arbitrarily weight these forces
    sep.mult(1.5);
    ali.mult(1.0);
    coh.mult(1.0);
    
    // Add the force vectors to particle's velocity
    p.vx += sep.x;
    p.vy += sep.y;
    p.vz += sep.z;
    
    p.vx += ali.x;
    p.vy += ali.y;
    p.vz += ali.z;
    
    p.vx += coh.x;
    p.vy += coh.y;
    p.vz += coh.z;
    
    // Limit speed
    let speed = sqrt(p.vx * p.vx + p.vy * p.vy + p.vz * p.vz);
    if (speed > 1) {
      p.vx = (p.vx / speed) * 1;
      p.vy = (p.vy / speed) * 1;
      p.vz = (p.vz / speed) * 1;
    }
    
    // Update position
    p.x += p.vx;
    p.y += p.vy;
    p.z += p.vz;
    
    // Wrap around edges
    if (p.x > width/2 + 100) p.x = -width/2 - 100;
    if (p.x < -width/2 - 100) p.x = width/2 + 100;
    if (p.y > height/2 + 100) p.y = -height/2 - 100;
    if (p.y < -height/2 - 100) p.y = height/2 + 100;
    if (p.z > 300) p.z = -300;
    if (p.z < -300) p.z = 300;
  }
}

function drawParticles() {
  // Draw all particles
  for (let p of particles) {
    push();
    translate(p.x, p.y, p.z);
    
    let pulse = sin(time * 5 + p.x * 0.01) * 0.3 + 0.7;
    let scale = p.size * pulse;
    
    fill(p.hue, p.saturation, p.brightness, 0.8);
    noStroke();
    
    sphere(scale, 4, 4);
    
    pop();
  }
}

function separate(p) {
  let steer = createVector(0, 0, 0);
  let count = 0;
  
  for (let other of particles) {
    let d = dist(p.x, p.y, p.z, other.x, other.y, other.z);
    
    if ((d > 0) && (d < 20)) {
      let diff = p5.Vector.sub(createVector(p.x, p.y, p.z), createVector(other.x, other.y, other.z));
      diff.normalize();
      diff.div(d); // Weight by distance
      steer.add(diff);
      count++;
    }
  }
  
  if (count > 0) {
    steer.div(count);
    steer.normalize();
    steer.mult(0.5);
  }
  
  return steer;
}

function align(p) {
  let sum = createVector(0, 0, 0);
  let count = 0;
  
  for (let other of particles) {
    let d = dist(p.x, p.y, p.z, other.x, other.y, other.z);
    
    if ((d > 0) && (d < 50)) {
      sum.add(createVector(other.vx, other.vy, other.vz));
      count++;
    }
  }
  
  if (count > 0) {
    sum.div(count);
    sum.normalize();
    sum.mult(0.5);
  }
  
  return sum;
}

function cohesion(p) {
  let sum = createVector(0, 0, 0);
  let count = 0;
  
  for (let other of particles) {
    let d = dist(p.x, p.y, p.z, other.x, other.y, other.z);
    
    if ((d > 0) && (d < 50)) {
      sum.add(createVector(other.x, other.y, other.z));
      count++;
    }
  }
  
  if (count > 0) {
    sum.div(count);
    let desired = p5.Vector.sub(sum, createVector(p.x, p.y, p.z));
    desired.normalize();
    desired.mult(0.5);
    
    return desired;
  } else {
    return createVector(0, 0, 0);
  }
}

function drawFungalStructure(scale) {
  let detail = 3; // Reduce geometry detail to stay within budget
  
  // Main fungal structure
  push();
  rotateX(time * 0.5);
  rotateY(time * 0.3);
  rotateZ(time * 0.2);
  
  // Draw a central core
  sphere(scale * 0.4, detail, detail);
  
  // Draw branching arms
  for (let i = 0; i < 6; i++) {
    push();
    rotateZ(i * TWO_PI / 6);
    
    // Arm length and thickness
    let armLength = scale * 0.8;
    let armThickness = scale * 0.1;
    
    // Draw the arm as a series of connected cylinders
    for (let j = 0; j < 3; j++) {
      push();
      
      // Position along the arm
      translate(0, -armLength / 2 + j * armLength / 3, 0);
      
      // Branching effect
      let branchStrength = sin(time + j) * 0.5 + 0.5;
      rotateZ(branchStrength * 0.5);
      
      // Cylinder
      cylinder(armThickness, armLength / 3, detail, false);
      
      pop();
    }
    
    pop();
  }
  
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
