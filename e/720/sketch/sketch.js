let lines = [];
let particles = [];
let residues = [];
let grid = [];

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(0.5, 2));
    this.size = random(2, 6);
    this.life = 1;
  }

  update() {
    this.pos.add(this.vel);
    this.vel.mult(0.98);
    this.life -= 0.005;
  }

  display() {
    noStroke();
    fill(255, 255, 255, this.life * 255);
    ellipse(this.pos.x, this.pos.y, this.size * this.life);
  }
}

class Line {
  constructor(a, b) {
    this.a = a;
    this.b = b;
    this.strength = random(0.5, 1);
    this.segments = [];
    this.buildSegments();
  }

  buildSegments() {
    let d = dist(this.a.pos.x, this.a.pos.y, this.b.pos.x, this.b.pos.y);
    let count = floor(d / 10);
    this.segments = [];
    for (let i = 0; i <= count; i++) {
      let t = map(i, 0, count, 0, 1);
      let x = lerp(this.a.pos.x, this.b.pos.x, t);
      let y = lerp(this.a.pos.y, this.b.pos.y, t);
      this.segments.push(createVector(x, y));
    }
  }

  update() {
    this.buildSegments();
  }

  display() {
    stroke(255, 255, 255, 100 * this.strength);
    strokeWeight(1);
    noFill();
    beginShape();
    for (let v of this.segments) {
      vertex(v.x, v.y);
    }
    endShape();
  }

  isDead() {
    return this.a.life <= 0 || this.b.life <= 0;
  }
}

class Residue {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.life = 1;
    this.size = random(3, 8);
  }

  update() {
    this.life -= 0.01;
  }

  display() {
    noStroke();
    fill(255, 100, 200, this.life * 200);
    ellipse(this.pos.x, this.pos.y, this.size * this.life);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);

  // Initialize particles
  for (let i = 0; i < 100; i++) {
    particles.push(new Particle(random(width), random(height)));
  }

  // Initialize lines
  for (let i = 0; i < 50; i++) {
    let a = random(particles);
    let b = random(particles);
    if (a !== b) {
      lines.push(new Line(a, b));
    }
  }

  // Grid for spatial hashing
  let cellSize = 50;
  let cols = ceil(width / cellSize);
  let rows = ceil(height / cellSize);
  grid = new Array(cols * rows).fill().map(() => []);
}

function draw() {
  background(10, 10, 20);

  // Update and display particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.update();
    p.display();

    if (p.life <= 0) {
      // Create residue when particle dies
      residues.push(new Residue(p.pos.x, p.pos.y));
      particles.splice(i, 1);
    }
  }

  // Update and display lines
  for (let i = lines.length - 1; i >= 0; i--) {
    let l = lines[i];
    l.update();

    if (l.isDead()) {
      // Create residue when line dies
      residues.push(new Residue(l.a.pos.x, l.a.pos.y));
      residues.push(new Residue(l.b.pos.x, l.b.pos.y));
      lines.splice(i, 1);
    } else {
      l.display();
    }
  }

  // Update and display residues
  for (let i = residues.length - 1; i >= 0; i--) {
    let r = residues[i];
    r.update();
    r.display();

    if (r.life <= 0) {
      residues.splice(i, 1);
    }
  }

  // Reconnect particles occasionally
  if (frameCount % 30 === 0 && lines.length < 70) {
    let a = random(particles);
    let b = random(particles);
    if (a !== b && dist(a.pos.x, a.pos.y, b.pos.x, b.pos.y) < 200) {
      lines.push(new Line(a, b));
    }
  }

  // Add new particles occasionally
  if (frameCount % 60 === 0 && particles.length < 150) {
    particles.push(new Particle(random(width), random(height)));
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
