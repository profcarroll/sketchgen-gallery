let particles = [];
let connections = [];
const particleCount = 200;
const connectionDistance = 150;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      pos: createVector(random(width), random(height), random(-100, 100)),
      vel: p5.Vector.random3D().mult(random(0.5, 2)),
      size: random(2, 8),
      hue: random(360),
      life: 1,
      decay: random(0.001, 0.005)
    });
  }
}

function draw() {
  background(0, 0, 0, 0.05);
  time += 0.01;

  // Move and update particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Update position with noise-based movement
    p.pos.add(p.vel);
    
    // Bounce off edges
    if (p.pos.x < -width/2 || p.pos.x > width/2) p.vel.x *= -1;
    if (p.pos.y < -height/2 || p.pos.y > height/2) p.vel.y *= -1;
    if (p.pos.z < -200 || p.pos.z > 200) p.vel.z *= -1;

    // Update life and decay
    p.life -= p.decay;
    if (p.life <= 0) {
      p.pos = createVector(random(width), random(height), random(-100, 100));
      p.life = 1;
      p.hue = (p.hue + 10) % 360;
    }
    
    // Draw particle
    push();
    translate(p.pos.x, p.pos.y, p.pos.z);
    noStroke();
    fill(p.hue, 80, 90, p.life);
    sphere(p.size);
    pop();
  }

  // Draw connections between close particles
  beginShape(LINES);
  stroke(255, 30);
  noFill();

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let a = particles[i];
      let b = particles[j];
      let d = dist(a.pos.x, a.pos.y, a.pos.z, b.pos.x, b.pos.y, b.pos.z);
      
      if (d < connectionDistance) {
        let alpha = map(d, 0, connectionDistance, 1, 0);
        stroke(255, alpha * 30);
        vertex(a.pos.x, a.pos.y, a.pos.z);
        vertex(b.pos.x, b.pos.y, b.pos.z);
      }
    }
  }
  endShape();
}
