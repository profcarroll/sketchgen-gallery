let particles = [];
let connections = [];
let trails = [];
let time = 0;

class Particle {
  constructor(x, y, z) {
    this.pos = createVector(x, y, z);
    this.vel = p5.Vector.random3D().mult(random(0.5, 2));
    this.acc = createVector(0, 0, 0);
    this.size = random(2, 6);
    this.color = color(random(100, 255), random(100, 255), random(255), 200);
    this.trail = [];
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);

    // Add to trail
    this.trail.push(this.pos.copy());
    if (this.trail.length > 20) {
      this.trail.shift();
    }
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    noStroke();
    fill(this.color);
    sphere(this.size);
    pop();
  }

  drawTrail() {
    if (this.trail.length < 2) return;
    beginShape();
    for (let i = 0; i < this.trail.length; i++) {
      const alpha = map(i, 0, this.trail.length, 0, 150);
      const c = color(red(this.color), green(this.color), blue(this.color), alpha);
      fill(c);
      vertex(this.trail[i].x, this.trail[i].y, this.trail[i].z);
    }
    endShape();
  }
}

class Connection {
  constructor(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
    this.life = 1.0;
  }

  update() {
    this.life -= 0.01;
  }

  display() {
    if (this.life <= 0) return;
    const alpha = map(this.life, 0, 1, 0, 255);
    stroke(255, 255, 255, alpha);
    strokeWeight(map(this.life, 0, 1, 0.5, 2));
    line(this.p1.pos.x, this.p1.pos.y, this.p1.pos.z,
         this.p2.pos.x, this.p2.pos.y, this.p2.pos.z);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create initial particles
  for (let i = 0; i < 150; i++) {
    const x = random(-width/2, width/2);
    const y = random(-height/2, height/2);
    const z = random(-200, 200);
    particles.push(new Particle(x, y, z));
  }

  // Create initial connections
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const d = dist(particles[i].pos.x, particles[i].pos.y, particles[i].pos.z,
                    particles[j].pos.x, particles[j].pos.y, particles[j].pos.z);
      if (d < 150) {
        connections.push(new Connection(particles[i], particles[j]));
      }
    }
  }

  frameRate(30);
}

function draw() {
  background(0);

  time += 0.01;
  
  // Update and display particles
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    
    // Apply some forces to make the system dynamic
    const force = createVector(
      sin(time + i * 0.1) * 0.1,
      cos(time + i * 0.1) * 0.1,
      sin(time * 0.5 + i * 0.2) * 0.1
    );
    p.applyForce(force);
    
    // Keep particles within bounds
    if (abs(p.pos.x) > width/2 + 100 || abs(p.pos.y) > height/2 + 100) {
      p.vel.mult(-0.5);
    }
    
    p.update();
    p.display();
    p.drawTrail();
  }

  // Update and display connections
  for (let i = connections.length - 1; i >= 0; i--) {
    const c = connections[i];
    c.update();
    if (c.life <= 0) {
      connections.splice(i, 1);
    } else {
      c.display();
    }
  }

  // Occasionally break a connection and create a discharge
  if (random() < 0.02 && connections.length > 0) {
    const index = floor(random(connections.length));
    const broken = connections.splice(index, 1)[0];
    
    // Create a spectral trail from the break point
    for (let i = 0; i < 50; i++) {
      trails.push({
        pos: broken.p1.pos.copy(),
        vel: p5.Vector.random3D().mult(random(2, 5)),
        life: 1.0,
        size: random(3, 8),
        color: color(random(200, 300), 100, 100, 255)
      });
    }
  }

  // Update and display trails
  for (let i = trails.length - 1; i >= 0; i--) {
    const t = trails[i];
    
    t.pos.add(t.vel);
    t.vel.mult(0.95); // Slow down
    t.life -= 0.02;
    
    if (t.life <= 0) {
      trails.splice(i, 1);
      continue;
    }
    
    push();
    translate(t.pos.x, t.pos.y, t.pos.z);
    noStroke();
    fill(t.color);
    sphere(t.size);
    pop();
  }

  // Occasionally add new connections
  if (random() < 0.05 && particles.length > 2) {
    const i = floor(random(particles.length));
    const j = floor(random(particles.length));
    if (i !== j) {
      const p1 = particles[i];
      const p2 = particles[j];
      const d = dist(p1.pos.x, p1.pos.y, p1.pos.z,
                     p2.pos.x, p2.pos.y, p2.pos.z);
      if (d < 200 && random() < 0.5) {
        connections.push(new Connection(p1, p2));
      }
    }
  }

  // Occasionally create a crystal formation from trails
  if (random() < 0.005 && trails.length > 50) {
    const crystal = [];
    for (let i = 0; i < 30; i++) {
      const index = floor(random(trails.length));
      if (index < trails.length) {
        crystal.push(trails[index]);
      }
    }
    
    // Draw a geometric structure based on these points
    beginShape();
    for (const t of crystal) {
      vertex(t.pos.x, t.pos.y, t.pos.z);
    }
    endShape(CLOSE);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
