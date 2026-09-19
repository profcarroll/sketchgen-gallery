let particles = [];
const numParticles = 500;
const repulsionRadius = 80;
const repulsionStrength = 0.5;
let spiralCenterX, spiralCenterY;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 255);
  
  // Initialize particles with random positions and velocities
  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: random(-1, 1),
      vy: random(-1, 1),
      hue: random(255),
      size: random(2, 6)
    });
  }
  
  spiralCenterX = width / 2;
  spiralCenterY = height / 2;
}

function draw() {
  background(0, 0, 0, 30); // Semi-transparent background for trail effect
  
  time += 0.01;
  
  // Update and display particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Apply repulsion forces from nearby particles
    for (let j = 0; j < particles.length; j++) {
      if (i !== j) {
        let other = particles[j];
        let dx = p.x - other.x;
        let dy = p.y - other.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < repulsionRadius && distance > 0) {
          let force = repulsionStrength * (repulsionRadius - distance) / repulsionRadius;
          p.vx += dx * force * 0.01;
          p.vy += dy * force * 0.01;
        }
      }
    }
    
    // Add some spiral motion
    let dx = p.x - spiralCenterX;
    let dy = p.y - spiralCenterY;
    let angle = atan2(dy, dx);
    let radius = Math.sqrt(dx * dx + dy * dy);
    
    // Spiral movement
    p.vx += -dy * 0.0005;
    p.vy += dx * 0.0005;
    
    // Update position with velocity
    p.x += p.vx;
    p.y += p.vy;
    
    // Apply damping to prevent infinite acceleration
    p.vx *= 0.98;
    p.vy *= 0.98;
    
    // Wrap around screen edges
    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;
    
    // Draw particle as a streak
    stroke(p.hue, 255, 255, 150);
    noFill();
    strokeWeight(p.size);
    
    // Draw trail
    point(p.x, p.y);
  }
  
  // Add a subtle central force to enhance spiral formations
  let centerX = width / 2 + cos(time) * 50;
  let centerY = height / 2 + sin(time) * 50;
  
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    let dx = p.x - centerX;
    let dy = p.y - centerY;
    let distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 10) {
      let force = 0.0002;
      p.vx -= dx * force;
      p.vy -= dy * force;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
