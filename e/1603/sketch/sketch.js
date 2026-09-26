let particles = [];
let noiseScale = 0.002;
let noiseStrength = 0.1;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Preallocate particles
  for (let i = 0; i < 1500; i++) {
    particles.push({
      pos: createVector(random(width), random(height)),
      vel: createVector(0, 0),
      size: random(1, 3),
      hue: random(180, 240),
      alpha: random(0.05, 0.2),
      age: random(100),
      life: random(100, 300)
    });
  }
}

function draw() {
  // Semi-transparent background for trail effect
  background(0, 0, 0, 0.03);
  
  // Update and display particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Noise-based movement
    let nx = noise(p.pos.x * noiseScale, p.pos.y * noiseScale) - 0.5;
    let ny = noise(p.pos.x * noiseScale + 1000, p.pos.y * noiseScale + 1000) - 0.5;
    
    p.vel.x += nx * noiseStrength;
    p.vel.y += ny * noiseStrength;
    
    // Apply velocity
    p.pos.add(p.vel);
    
    // Add some damping
    p.vel.mult(0.95);
    
    // Boundary check and reset
    if (p.pos.x < 0 || p.pos.x > width ||
        p.pos.y < 0 || p.pos.y > height) {
      p.pos.set(random(width), random(height));
      p.vel.set(0, 0);
    }
    
    // Age the particle
    p.age++;
    if (p.age > p.life) {
      p.age = 0;
      p.pos.set(random(width), random(height));
      p.life = random(100, 300);
    }
    
    // Draw particle
    noStroke();
    fill(p.hue, 50, 90, p.alpha);
    ellipse(p.pos.x, p.pos.y, p.size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
