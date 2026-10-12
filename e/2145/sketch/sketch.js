let pyramids = [];
let particles = [];
let time = 0;
let particlePositions = [];
let particleColors = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create pyramidal structures
  for (let i = 0; i < 15; i++) {
    pyramids.push({
      x: random(-width/3, width/3),
      y: height/2,
      z: random(-height/3, height/3),
      size: random(40, 100),
      hue: random(200, 260)
    });
  }
  
  // Pre-allocate particle arrays for batching
  particlePositions = new Float32Array(1000 * 3);
  particleColors = new Float32Array(1000 * 4);
  
  // Create initial particles
  for (let i = 0; i < 1000; i++) {
    particles.push({
      x: random(-width/2, width/2),
      y: height/2,
      z: random(-height/2, height/2),
      vx: 0,
      vy: 0,
      vz: 0,
      size: random(1, 2),
      hue: random(180, 240),
      alpha: random(0.5, 1),
      life: random(100, 300)
    });
  }
}

function draw() {
  background(0, 0, 5, 1);
  
  time += 0.01;
  
  // Draw pyramids
  for (let pyramid of pyramids) {
    push();
    translate(pyramid.x, pyramid.y, pyramid.z);
    rotateX(time * 0.1);
    rotateY(time * 0.05);
    
    stroke(pyramid.hue, 80, 90, 0.8);
    noFill();
    
    beginShape();
    vertex(0, -pyramid.size/2, 0);
    vertex(-pyramid.size/2, pyramid.size/2, -pyramid.size/2);
    vertex(pyramid.size/2, pyramid.size/2, -pyramid.size/2);
    vertex(pyramid.size/2, pyramid.size/2, pyramid.size/2);
    vertex(-pyramid.size/2, pyramid.size/2, pyramid.size/2);
    endShape(CLOSE);
    
    beginShape();
    vertex(0, -pyramid.size/2, 0);
    vertex(-pyramid.size/2, pyramid.size/2, -pyramid.size/2);
    vertex(pyramid.size/2, pyramid.size/2, -pyramid.size/2);
    endShape(CLOSE);
    
    beginShape();
    vertex(0, -pyramid.size/2, 0);
    vertex(pyramid.size/2, pyramid.size/2, -pyramid.size/2);
    vertex(pyramid.size/2, pyramid.size/2, pyramid.size/2);
    endShape(CLOSE);
    
    beginShape();
    vertex(0, -pyramid.size/2, 0);
    vertex(-pyramid.size/2, pyramid.size/2, pyramid.size/2);
    vertex(pyramid.size/2, pyramid.size/2, pyramid.size/2);
    endShape(CLOSE);
    
    beginShape();
    vertex(0, -pyramid.size/2, 0);
    vertex(-pyramid.size/2, pyramid.size/2, -pyramid.size/2);
    vertex(-pyramid.size/2, pyramid.size/2, pyramid.size/2);
    endShape(CLOSE);
    
    pop();
  }
  
  // Update and draw particles in batches
  let particleCount = 0;
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    
    // Apply current effects
    let currentForce = createVector(
      sin(time * 0.02 + p.x * 0.01) * 0.05,
      cos(time * 0.03 + p.z * 0.01) * 0.05,
      sin(time * 0.01 + p.y * 0.01) * 0.05
    );
    
    p.vx += currentForce.x;
    p.vy += currentForce.y;
    p.vz += currentForce.z;
    
    // Apply some damping
    p.vx *= 0.98;
    p.vy *= 0.98;
    p.vz *= 0.98;
    
    p.x += p.vx;
    p.y += p.vy;
    p.z += p.vz;
    
    // Reset particles that go too far
    if (p.y > height/2 + 100 || p.life < 0) {
      p.x = random(-width/2, width/2);
      p.y = height/2;
      p.z = random(-height/2, height/2);
      p.vx = 0;
      p.vy = 0;
      p.vz = 0;
      p.life = random(100, 300);
    }
    
    p.life--;
    
    // Batch particle data for drawing
    if (particleCount < 1000) {
      let idx = particleCount * 3;
      particlePositions[idx] = p.x;
      particlePositions[idx + 1] = p.y;
      particlePositions[idx + 2] = p.z;
      
      idx = particleCount * 4;
      particleColors[idx] = p.hue;
      particleColors[idx + 1] = 80;
      particleColors[idx + 2] = 90;
      particleColors[idx + 3] = p.alpha;
      
      particleCount++;
    }
  }
  
  // Draw all particles as one point cloud
  noStroke();
  beginShape(POINTS);
  for (let i = 0; i < particleCount; i++) {
    let idx = i * 3;
    vertex(particlePositions[idx], particlePositions[idx + 1], particlePositions[idx + 2]);
  }
  endShape();
  
  // Draw particle colors separately
  colorMode(RGB);
  for (let i = 0; i < particleCount; i++) {
    let idx = i * 4;
    fill(particleColors[idx], particleColors[idx + 1], particleColors[idx + 2], particleColors[idx + 3]);
    point(particlePositions[idx], particlePositions[idx + 1], particlePositions[idx + 2]);
  }
  colorMode(HSB);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
