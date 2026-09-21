let particles1 = [];
let particles2 = [];
let numParticles = 300;
let helixRadius = 150;
let helixHeight = 300;
let rotationSpeed = 0.005;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize particles for both swarms
  for (let i = 0; i < numParticles; i++) {
    particles1.push({
      pos: createVector(random(width), random(height)),
      vel: p5.Vector.random3D().mult(1.5),
      hue: random(60, 120),
      size: random(2, 5)
    });
    
    particles2.push({
      pos: createVector(random(width), random(height)),
      vel: p5.Vector.random3D().mult(1.5),
      hue: random(240, 300),
      size: random(2, 5)
    });
  }
}

function draw() {
  background(0, 0, 0, 0.1); // Semi-transparent background for trail effect

  // Update and display particles
  for (let i = 0; i < numParticles; i++) {
    updateParticle(particles1[i]);
    updateParticle(particles2[i]);
    
    displayParticle(particles1[i]);
    displayParticle(particles2[i]);
  }

  // Draw helical vortex connections between particles
  drawConnections();
}

function updateParticle(p) {
  // Move particle
  p.pos.add(p.vel);
  
  // Apply some swirling motion to simulate vortex
  let angle = frameCount * rotationSpeed;
  let swirlForce = createVector(
    sin(angle + p.pos.x * 0.01) * 0.2,
    cos(angle + p.pos.y * 0.01) * 0.2,
    sin(angle + p.pos.z * 0.01) * 0.2
  );
  
  p.vel.add(swirlForce);
  
  // Keep particles within canvas bounds with wrap-around
  if (p.pos.x > width) p.pos.x = 0;
  if (p.pos.x < 0) p.pos.x = width;
  if (p.pos.y > height) p.pos.y = 0;
  if (p.pos.y < 0) p.pos.y = height;
}

function displayParticle(p) {
  noStroke();
  fill(p.hue, 100, 100, 0.8);
  ellipse(p.pos.x, p.pos.y, p.size);
}

function drawConnections() {
  // Draw connections between particles that are close
  stroke(255, 50);
  noFill();
  
  beginShape(LINES);
  for (let i = 0; i < numParticles; i++) {
    let p1 = particles1[i];
    let p2 = particles2[i];
    
    // Draw line between the two particles
    vertex(p1.pos.x, p1.pos.y);
    vertex(p2.pos.x, p2.pos.y);
    
    // Also draw connections to nearby particles in each swarm
    for (let j = 0; j < numParticles; j++) {
      if (i === j) continue;
      
      let d1 = dist(p1.pos.x, p1.pos.y, particles1[j].pos.x, particles1[j].pos.y);
      let d2 = dist(p2.pos.x, p2.pos.y, particles2[j].pos.x, particles2[j].pos.y);
      
      if (d1 < 80) {
        vertex(p1.pos.x, p1.pos.y);
        vertex(particles1[j].pos.x, particles1[j].pos.y);
      }
      
      if (d2 < 80) {
        vertex(p2.pos.x, p2.pos.y);
        vertex(particles2[j].pos.x, particles2[j].pos.y);
      }
    }
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
