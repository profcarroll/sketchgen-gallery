let particles = [];
let connections = [];
let residueParticles = [];
let time = 0;
const MAX_PARTICLES = 300;
const MAX_CONNECTIONS = 500;
const RESIDUE_LIFETIME = 120;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  frameRate(30);

  // Initialize particles
  for (let i = 0; i < MAX_PARTICLES; i++) {
    particles.push({
      pos: createVector(random(-width/2, width/2), random(-height/2, height/2), random(-100, 100)),
      vel: p5.Vector.random3D().mult(random(0.5, 2)),
      life: random(100, 300),
      maxLife: random(100, 300)
    });
  }

  // Initialize residue particles
  for (let i = 0; i < 200; i++) {
    residueParticles.push({
      pos: createVector(random(-width/2, width/2), random(-height/2, height/2), random(-100, 100)),
      vel: p5.Vector.random3D().mult(random(0.1, 0.5)),
      life: random(60, 120),
      maxLife: random(60, 120),
      size: random(1, 3)
    });
  }
}

function draw() {
  background(10, 10, 20);
  time += 0.01;

  // Camera movement
  let cx = sin(time * 0.2) * width/4;
  let cy = cos(time * 0.3) * height/4;
  let cz = sin(time * 0.1) * 200;
  camera(0, 0, (height/2) / tan(PI/6), cx, cy, cz, 0, 1, 0);

  // Update and draw particles
  noStroke();
  beginShape(POINTS);
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.pos.add(p.vel);
    p.life--;
    
    if (p.life <= 0) {
      // Reuse particle
      p.pos = createVector(random(-width/2, width/2), random(-height/2, height/2), random(-100, 100));
      p.vel = p5.Vector.random3D().mult(random(0.5, 2));
      p.life = p.maxLife;
    }
    
    // Add pulsing effect
    let size = map(p.life, 0, p.maxLife, 1, 4) * (1 + sin(time * 2 + i) * 0.5);
    fill(255, 200, 100, map(p.life, 0, p.maxLife, 0, 255));
    vertex(p.pos.x, p.pos.y, p.pos.z);
  }
  endShape();

  // Update and draw residue particles
  noStroke();
  beginShape(POINTS);
  for (let i = residueParticles.length - 1; i >= 0; i--) {
    let r = residueParticles[i];
    r.pos.add(r.vel);
    r.life--;
    
    if (r.life <= 0) {
      // Reuse residue particle
      r.pos = createVector(random(-width/2, width/2), random(-height/2, height/2), random(-100, 100));
      r.vel = p5.Vector.random3D().mult(random(0.1, 0.5));
      r.life = r.maxLife;
    }
    
    let alpha = map(r.life, 0, r.maxLife, 0, 255);
    fill(255, 100, 100, alpha);
    vertex(r.pos.x, r.pos.y, r.pos.z);
  }
  endShape();

  // Draw connections
  strokeWeight(0.5);
  beginShape(LINES);
  for (let i = connections.length - 1; i >= 0; i--) {
    let c = connections[i];
    c.life--;
    
    if (c.life <= 0) {
      connections.splice(i, 1);
      continue;
    }
    
    let alpha = map(c.life, 0, c.maxLife, 0, 255);
    stroke(100, 255, 255, alpha);
    vertex(c.start.x, c.start.y, c.start.z);
    vertex(c.end.x, c.end.y, c.end.z);
  }
  endShape();

  // Connect nearby particles with new lines periodically
  if (frameCount % 10 === 0) {
    for (let i = 0; i < 5; i++) {
      let p1 = random(particles);
      let p2 = random(particles);
      
      // Only connect if they are close enough
      let d = dist(p1.pos.x, p1.pos.y, p1.pos.z, p2.pos.x, p2.pos.y, p2.pos.z);
      if (d < 150 && connections.length < MAX_CONNECTIONS) {
        connections.push({
          start: createVector(p1.pos.x, p1.pos.y, p1.pos.z),
          end: createVector(p2.pos.x, p2.pos.y, p2.pos.z),
          life: random(30, 60),
          maxLife: random(30, 60)
        });
      }
    }
  }

  // Occasionally break connections and leave residues
  if (frameCount % 20 === 0 && connections.length > 0) {
    let index = floor(random(connections.length));
    let c = connections[index];
    connections.splice(index, 1);
    
    // Create residue particles at the connection points
    for (let i = 0; i < 3; i++) {
      residueParticles.push({
        pos: createVector(c.start.x, c.start.y, c.start.z),
        vel: p5.Vector.random3D().mult(random(0.1, 0.5)),
        life: RESIDUE_LIFETIME,
        maxLife: RESIDUE_LIFETIME,
        size: random(1, 3)
      });
    }
  }

  // Limit total connections to prevent memory issues
  if (connections.length > MAX_CONNECTIONS) {
    connections.splice(0, connections.length - MAX_CONNECTIONS);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
