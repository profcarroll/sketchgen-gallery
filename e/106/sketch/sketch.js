let particles = [];
let bonds = [];
let time = 0;
let speed = 0.02;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create initial particles
  for (let i = 0; i < 50; i++) {
    particles.push({
      x: random(-500, 500),
      y: random(-500, 500),
      z: random(-1000, 1000),
      size: random(10, 30),
      hue: random(360)
    });
  }
  
  // Create bonds between nearby particles
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let d = dist(particles[i].x, particles[i].y, particles[i].z,
                   particles[j].x, particles[j].y, particles[j].z);
      if (d < 200) {
        bonds.push({
          p1: i,
          p2: j,
          strength: map(d, 0, 200, 1, 0.2)
        });
      }
    }
  }
}

function draw() {
  background(0);
  
  // Camera movement
  time += speed;
  let camZ = -time * 50;
  camera(0, 0, camZ, 0, 0, 0, 0, 1, 0);
  
  // Add more particles as we move
  if (frameCount % 30 === 0) {
    particles.push({
      x: random(-500, 500),
      y: random(-500, 500),
      z: camZ - 1000,
      size: random(10, 30),
      hue: random(360)
    });
    
    // Add new bonds
    for (let i = particles.length - 1; i >= 0; i--) {
      if (i === particles.length - 1) continue;
      let d = dist(particles[i].x, particles[i].y, particles[i].z,
                   particles[particles.length-1].x, 
                   particles[particles.length-1].y, 
                   particles[particles.length-1].z);
      if (d < 200 && random() > 0.7) {
        bonds.push({
          p1: i,
          p2: particles.length - 1,
          strength: map(d, 0, 200, 1, 0.2)
        });
      }
    }
  }
  
  // Remove old particles
  if (particles.length > 100) {
    particles.shift();
    bonds = bonds.filter(bond => 
      bond.p1 < particles.length && bond.p2 < particles.length
    );
  }
  
  // Draw bonds
  stroke(255, 0.8);
  strokeWeight(1);
  noFill();
  for (let bond of bonds) {
    let p1 = particles[bond.p1];
    let p2 = particles[bond.p2];
    if (p1 && p2) {
      line(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
    }
  }
  
  // Draw particles
  noStroke();
  for (let particle of particles) {
    push();
    translate(particle.x, particle.y, particle.z);
    
    // Glow effect
    fill(particle.hue, 100, 100, 0.8);
    sphere(particle.size * 0.5);
    
    fill(particle.hue, 100, 100, 0.4);
    sphere(particle.size);
    
    pop();
  }
  
  // Increase speed over time for acceleration effect
  speed = min(speed + 0.00001, 0.05);
}
