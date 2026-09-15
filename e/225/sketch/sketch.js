let time = 0;
let particles = [];
const numParticles = 300;
const maxConnections = 500;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize particles with random positions and velocities
  for (let i = 0; i < numParticles; i++) {
    particles.push({
      pos: createVector(random(width), random(height)),
      vel: p5.Vector.random2D().mult(random(0.5, 2)),
      hue: random(360),
      size: random(2, 8)
    });
  }
}

function draw() {
  background(0, 0, 0, 0.05); // Semi-transparent background for trail effect
  
  time += 0.01;
  
  // Draw connections between nearby particles
  let totalConnections = 0;
  beginShape(LINES);
  for (let i = 0; i < particles.length; i++) {
    const p1 = particles[i];
    
    for (let j = i + 1; j < particles.length; j++) {
      const p2 = particles[j];
      
      // Calculate distance
      let d = dist(p1.pos.x, p1.pos.y, p2.pos.x, p2.pos.y);
      
      // Only draw if they are close enough and we haven't exceeded max connections
      if (d < 100 && totalConnections < maxConnections) {
        stroke(hueBlend(p1.hue, p2.hue), 80, 90, 0.3);
        vertex(p1.pos.x, p1.pos.y);
        vertex(p2.pos.x, p2.pos.y);
        totalConnections += 1;
      }
    }
  }
  endShape();
  
  // Update and draw particles
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    
    // Apply some physics - move with velocity
    p.pos.add(p.vel);
    
    // Wrap around edges
    if (p.pos.x > width) p.pos.x = 0;
    else if (p.pos.x < 0) p.pos.x = width;
    if (p.pos.y > height) p.pos.y = 0;
    else if (p.pos.y < 0) p.pos.y = height;
    
    // Add some periodic motion to create flowing curves
    p.vel.rotate(0.005 * sin(time + i * 0.1));
    
    // Draw the particle as a point or small shape
    noStroke();
    fill(p.hue, 80, 90, 0.7);
    ellipse(p.pos.x, p.pos.y, p.size);
  }
}

function hueBlend(h1, h2) {
  return (h1 + h2) / 2 % 360;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
