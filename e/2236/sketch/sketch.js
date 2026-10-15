let particles = [];
const numParticles = 1000;
const trailLength = 50;
const searchRadius = 100;
const crystalRadius = 30;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Initialize particles
  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-50, 50),
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5),
      vz: random(-0.5, 0.5),
      hue: random(180, 240), // Cool blues and teals
      trail: [],
      age: 0,
      persistence: random(0.95, 0.99)
    });
  }
}

function draw() {
  background(20, 10, 5, 0.03); // Dark background with fade
  
  // Update and draw particles
  for (let p of particles) {
    // Apply velocity
    p.x += p.vx;
    p.y += p.vy;
    p.z += p.vz;
    
    // Bounce off edges
    if (p.x < -width/2 || p.x > width/2) p.vx *= -1;
    if (p.y < -height/2 || p.y > height/2) p.vy *= -1;
    if (p.z < -50 || p.z > 50) p.vz *= -1;
    
    // Add current position to trail
    p.trail.push({x: p.x, y: p.y, z: p.z});
    
    // Remove old points from trail
    if (p.trail.length > trailLength) {
      p.trail.shift();
    }
  }
  
  // Draw all trails in one batch
  beginShape(LINES);
  for (let p of particles) {
    for (let i = 0; i < p.trail.length - 1; i++) {
      const pointA = p.trail[i];
      const pointB = p.trail[i + 1];
      const alpha = map(i, 0, p.trail.length, 0.8, 0);
      const size = map(i, 0, p.trail.length, 2, 0.5);
      fill(p.hue, 80, 90, alpha);
      vertex(pointA.x, pointA.y, pointA.z);
      vertex(pointB.x, pointB.y, pointB.z);
    }
  }
  endShape();
  
  // Draw particle bodies and glow as points
  beginShape(POINTS);
  for (let p of particles) {
    fill(p.hue, 80, 90);
    vertex(p.x, p.y, p.z);
    
    fill(p.hue, 80, 90, 0.15);
    vertex(p.x, p.y, p.z);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Search mechanism activated by dragging
let searchActive = false;
let searchX, searchY;

function mousePressed() {
  searchActive = true;
  searchX = mouseX;
  searchY = mouseY;
}

function mouseDragged() {
  searchX = mouseX;
  searchY = mouseY;
  
  // Draw search trace
  stroke(200, 80, 90, 0.7);
  noFill();
  beginShape();
  vertex(mouseX, mouseY);
  endShape();
}

function mouseReleased() {
  searchActive = false;
}
