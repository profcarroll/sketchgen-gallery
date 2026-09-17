let particles = [];
const particleCount = 150;
const connections = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize particles with random positions and velocities
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      pos: createVector(random(-width/2, width/2), random(-height/2, height/2), random(-100, 100)),
      vel: p5.Vector.random3D().mult(random(0.5, 2)),
      size: random(5, 20),
      hue: random(360)
    });
  }
  
  // Precompute connections for performance
  for (let i = 0; i < particleCount; i++) {
    for (let j = i + 1; j < particleCount; j++) {
      if (dist(particles[i].pos.x, particles[i].pos.y, particles[i].pos.z,
               particles[j].pos.x, particles[j].pos.y, particles[j].pos.z) < 150) {
        connections.push([i, j]);
      }
    }
  }
}

function draw() {
  background(0, 0, 0, 0.05);
  
  // Rotate the entire scene for dynamic movement
  rotateX(frameCount * 0.002);
  rotateY(frameCount * 0.003);
  
  // Update and display particles
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    
    // Update position with velocity
    p.pos.add(p.vel);
    
    // Boundary check with gentle bounce
    if (abs(p.pos.x) > width/2 + 50) p.vel.x *= -0.9;
    if (abs(p.pos.y) > height/2 + 50) p.vel.y *= -0.9;
    if (abs(p.pos.z) > 200) p.vel.z *= -0.9;
    
    // Pulsate size and hue
    const pulse = sin(frameCount * 0.03 + i) * 0.5 + 0.5;
    p.size = 5 + pulse * 15;
    p.hue += 0.5;
    if (p.hue > 360) p.hue -= 360;
    
    // Draw particle
    push();
    translate(p.pos.x, p.pos.y, p.pos.z);
    noStroke();
    fill(p.hue, 80, 90, 0.7);
    sphere(p.size);
    pop();
  }
  
  // Draw connections between nearby particles
  stroke(255, 30);
  noFill();
  beginShape(LINES);
  for (let i = 0; i < connections.length; i++) {
    const [a, b] = connections[i];
    const pa = particles[a].pos;
    const pb = particles[b].pos;
    
    vertex(pa.x, pa.y, pa.z);
    vertex(pb.x, pb.y, pb.z);
  }
  endShape();
}
