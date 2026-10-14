let particles = [];
const numParticles = 200;
const trailLength = 100;
const searchRadius = 80;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Initialize particles
  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5),
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
    
    // Bounce off edges
    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;
    
    // Add current position to trail
    p.trail.push({x: p.x, y: p.y});
    
    // Remove old points from trail
    if (p.trail.length > trailLength) {
      p.trail.shift();
    }
    
    // Draw trail
    beginShape();
    for (let i = 0; i < p.trail.length; i++) {
      const point = p.trail[i];
      const alpha = map(i, 0, p.trail.length, 0.8, 0);
      const size = map(i, 0, p.trail.length, 4, 1);
      fill(p.hue, 80, 90, alpha);
      vertex(point.x, point.y);
    }
    endShape();
    
    // Draw particle body
    fill(p.hue, 80, 90);
    ellipse(p.x, p.y, 3, 3);
    
    // Draw glow effect
    fill(p.hue, 80, 90, 0.15);
    ellipse(p.x, p.y, 6, 6);
  }
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
