let particles = [];
let trails = [];
let flowField;
let noiseScale = 0.02;
let noiseStrength = 0.5;
let backgroundColor;

function setup() {
  createCanvas(800, 600);
  backgroundColor = color(10, 5, 20);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize particles
  for (let i = 0; i < 200; i++) {
    particles.push({
      pos: createVector(random(width), random(height)),
      vel: createVector(0, 0),
      size: random(2, 8),
      hue: random(200, 300),
      alpha: random(0.5, 1),
      trail: []
    });
  }
  
  // Initialize flow field
  flowField = new Array(width * height).fill(0);
}

function draw() {
  background(backgroundColor);
  
  // Update and display particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Noise-based movement
    let nx = noise(p.pos.x * noiseScale, p.pos.y * noiseScale) * noiseStrength;
    let ny = noise(p.pos.x * noiseScale + 1000, p.pos.y * noiseScale + 1000) * noiseStrength;
    
    p.vel.x += nx;
    p.vel.y += ny;
    
    // Limit velocity
    p.vel.limit(2);
    
    // Update position
    p.pos.add(p.vel);
    
    // Boundary check
    if (p.pos.x < 0 || p.pos.x > width || p.pos.y < 0 || p.pos.y > height) {
      p.pos = createVector(random(width), random(height));
      p.vel.mult(0);
    }
    
    // Add to trail
    p.trail.push(createVector(p.pos.x, p.pos.y));
    if (p.trail.length > 30) {
      p.trail.shift();
    }
    
    // Draw trail
    noFill();
    stroke(p.hue, 80, 90, 0.3);
    strokeWeight(1);
    beginShape();
    for (let v of p.trail) {
      vertex(v.x, v.y);
    }
    endShape();
    
    // Draw particle
    fill(p.hue, 80, 90, p.alpha);
    noStroke();
    ellipse(p.pos.x, p.pos.y, p.size, p.size);
  }
  
  // Occasionally create a flare
  if (frameCount % 100 === 0) {
    let x = random(width);
    let y = random(height);
    let size = random(20, 50);
    let hue = random(200, 300);
    
    fill(hue, 80, 90, 0.7);
    noStroke();
    ellipse(x, y, size, size);
    
    // Add glow effect
    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = color(hue, 80, 90);
    ellipse(x, y, size, size);
    drawingContext.shadowBlur = 0;
  }
}
