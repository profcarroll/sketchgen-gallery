let particles = [];
let connections = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create particles with random positions and velocities
  for (let i = 0; i < 200; i++) {
    particles.push({
      pos: createVector(random(-width/2, width/2), random(-height/2, height/2), random(-100, 100)),
      vel: p5.Vector.random3D().mult(random(0.5, 2)),
      hue: random(180, 240),
      size: random(2, 6)
    });
  }
}

function draw() {
  background(0, 0, 10, 0.05);
  
  time += 0.01;
  
  // Update and display particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Apply some physics to make movement more organic
    p.vel.mult(0.98);
    p.vel.add(p5.Vector.random3D().mult(0.1));
    
    // Move particle
    p.pos.add(p.vel);
    
    // Wrap around edges
    if (p.pos.x > width/2) p.pos.x = -width/2;
    if (p.pos.x < -width/2) p.pos.x = width/2;
    if (p.pos.y > height/2) p.pos.y = -height/2;
    if (p.pos.y < -height/2) p.pos.y = height/2;
    
    // Glow effect
    push();
    translate(p.pos.x, p.pos.y, p.pos.z);
    noStroke();
    fill(p.hue, 80, 95, 0.8);
    sphere(p.size);
    pop();
  }
  
  // Draw connections between close particles
  connections = [];
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let d = dist(
        particles[i].pos.x, particles[i].pos.y, particles[i].pos.z,
        particles[j].pos.x, particles[j].pos.y, particles[j].pos.z
      );
      
      if (d < 150) {
        connections.push({
          p1: particles[i],
          p2: particles[j],
          alpha: map(d, 0, 150, 0.8, 0)
        });
      }
    }
  }
  
  // Draw connections
  for (let conn of connections) {
    stroke(conn.p1.hue, 70, 90, conn.alpha);
    strokeWeight(1);
    line(
      conn.p1.pos.x, conn.p1.pos.y, conn.p1.pos.z,
      conn.p2.pos.x, conn.p2.pos.y, conn.p2.pos.z
    );
  }
  
  // Rotate the whole scene slowly for dynamic effect
  rotateY(time * 0.1);
  rotateX(sin(time * 0.3) * 0.2);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
