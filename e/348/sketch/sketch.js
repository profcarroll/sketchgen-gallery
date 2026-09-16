let particles = [];
let grid = [];
const gridSize = 20;
const particleCount = 300;
const time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize particles
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      pos: p5.Vector.random3D().mult(random(200, 300)),
      vel: p5.Vector.random3D().mult(random(0.5, 1.5)),
      size: random(5, 15),
      hue: random(360)
    });
  }
  
  // Initialize grid
  for (let i = 0; i < gridSize * gridSize; i++) {
    grid.push([]);
  }
}

function draw() {
  background(0, 0, 0, 0.05);
  noStroke();
  
  const t = millis() / 1000;
  
  // Update and display particles
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    
    // Oscillate position based on time and spatial harmonics
    const oscillation = sin(t * 0.5 + p.pos.x * 0.01) * cos(t * 0.3 + p.pos.y * 0.01);
    p.pos.add(p.vel);
    
    // Apply wave motion to position
    p.pos.x += sin(t + p.pos.z * 0.01) * 2;
    p.pos.y += cos(t + p.pos.x * 0.01) * 2;
    p.pos.z += sin(t + p.pos.y * 0.01) * 2;
    
    // Wrap around edges
    if (p.pos.mag() > 500) {
      p.pos.set(p5.Vector.random3D().mult(400));
    }
    
    // Update hue based on time and position
    p.hue = (p.hue + 0.2) % 360;
    
    // Draw particle
    push();
    translate(p.pos.x, p.pos.y, p.pos.z);
    rotateX(t * 0.1 + p.pos.z * 0.001);
    rotateY(t * 0.15 + p.pos.x * 0.001);
    
    fill(p.hue, 80, 90, 0.8);
    sphere(p.size * (1 + oscillation * 0.5));
    pop();
  }
  
  // Connect particles with lines based on proximity
  beginShape(LINES);
  for (let i = 0; i < particles.length; i++) {
    const p1 = particles[i];
    
    for (let j = i + 1; j < particles.length; j++) {
      const p2 = particles[j];
      
      // Check distance
      const d = p5.Vector.dist(p1.pos, p2.pos);
      
      if (d < 100) {
        stroke(hue(p1.hue), 80, 90, 0.2);
        vertex(p1.pos.x, p1.pos.y, p1.pos.z);
        vertex(p2.pos.x, p2.pos.y, p2.pos.z);
      }
    }
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
