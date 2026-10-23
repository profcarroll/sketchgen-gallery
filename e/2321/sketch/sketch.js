let structures = [];
let time = 0;
let flock = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize some crystalline structures
  for (let i = 0; i < 50; i++) {
    structures.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-200, 200),
      size: random(10, 50),
      age: random(100),
      hue: random(180, 240), // Cool grays to aqueous blues
      saturation: random(30, 60),
      brightness: random(70, 90)
    });
  }
  
  // Initialize flock of particles
  for (let i = 0; i < 100; i++) {
    flock.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-200, 200),
      vx: random(-1, 1),
      vy: random(-1, 1),
      vz: random(-1, 1),
      size: random(2, 6),
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
    
    // Create a branching structure that mimics cave formations
    drawCrystal(scale);
    
    pop();
    
    // Update age for next frame
    s.age += 0.5;
  }
  
  // Add new structures occasionally
  if (frameCount % 30 === 0 && structures.length < 150) {
    structures.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-200, 200),
      size: random(10, 50),
      age: 0,
      hue: random(180, 240),
      saturation: random(30, 60),
      brightness: random(70, 90)
    });
  }
  
  // Remove old structures that have aged too much
  for (let i = structures.length - 1; i >= 0; i--) {
    if (structures[i].age > 500) {
      structures.splice(i, 1);
    }
  }
  
  // Update and draw flock
  updateFlock();
  drawFlock();
}

function updateFlock() {
  for (let boid of flock) {
    // Apply simple flocking rules
    let sep = separate(boid); // Separation
    let ali = align(boid);     // Alignment
    let coh = cohesion(boid);  // Cohesion
    
    // Arbitrarily weight these forces
    sep.mult(1.5);
    ali.mult(1.0);
    coh.mult(1.0);
    
    // Add the force vectors to boid's velocity
    boid.vx += sep.x;
    boid.vy += sep.y;
    boid.vz += sep.z;
    
    boid.vx += ali.x;
    boid.vy += ali.y;
    boid.vz += ali.z;
    
    boid.vx += coh.x;
    boid.vy += coh.y;
    boid.vz += coh.z;
    
    // Limit speed
    let speed = sqrt(boid.vx * boid.vx + boid.vy * boid.vy + boid.vz * boid.vz);
    if (speed > 2) {
      boid.vx = (boid.vx / speed) * 2;
      boid.vy = (boid.vy / speed) * 2;
      boid.vz = (boid.vz / speed) * 2;
    }
    
    // Update position
    boid.x += boid.vx;
    boid.y += boid.vy;
    boid.z += boid.vz;
    
    // Wrap around edges
    if (boid.x > width/2 + 100) boid.x = -width/2 - 100;
    if (boid.x < -width/2 - 100) boid.x = width/2 + 100;
    if (boid.y > height/2 + 100) boid.y = -height/2 - 100;
    if (boid.y < -height/2 - 100) boid.y = height/2 + 100;
    if (boid.z > 300) boid.z = -300;
    if (boid.z < -300) boid.z = 300;
  }
}

function drawFlock() {
  // Draw all flock particles
  for (let boid of flock) {
    push();
    translate(boid.x, boid.y, boid.z);
    
    let pulse = sin(time * 5 + boid.x * 0.01) * 0.3 + 0.7;
    let scale = boid.size * pulse;
    
    fill(boid.hue, boid.saturation, boid.brightness, 0.8);
    noStroke();
    
    sphere(scale, 4, 4);
    
    pop();
  }
}

function separate(boid) {
  let steer = createVector(0, 0, 0);
  let count = 0;
  
  for (let other of flock) {
    let d = dist(boid.x, boid.y, boid.z, other.x, other.y, other.z);
    
    if ((d > 0) && (d < 20)) {
      let diff = p5.Vector.sub(createVector(boid.x, boid.y, boid.z), createVector(other.x, other.y, other.z));
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

function align(boid) {
  let sum = createVector(0, 0, 0);
  let count = 0;
  
  for (let other of flock) {
    let d = dist(boid.x, boid.y, boid.z, other.x, other.y, other.z);
    
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

function cohesion(boid) {
  let sum = createVector(0, 0, 0);
  let count = 0;
  
  for (let other of flock) {
    let d = dist(boid.x, boid.y, boid.z, other.x, other.y, other.z);
    
    if ((d > 0) && (d < 50)) {
      sum.add(createVector(other.x, other.y, other.z));
      count++;
    }
  }
  
  if (count > 0) {
    sum.div(count);
    let desired = p5.Vector.sub(sum, createVector(boid.x, boid.y, boid.z));
    desired.normalize();
    desired.mult(0.5);
    
    return desired;
  } else {
    return createVector(0, 0, 0);
  }
}

function drawCrystal(scale) {
  let detail = 4; // Reduce geometry detail to stay within budget
  
  // Main crystal structure
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
