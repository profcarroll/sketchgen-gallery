let lines = [];
let particles = [];
let time = 0;
const NUM_LINES = 150;
const NUM_PARTICLES = 300;
const MAX_SEGMENTS = 20;

class Line {
  constructor() {
    this.segments = [];
    this.color = color(random(100, 255), random(100, 255), random(200, 255), 200);
    this.create();
  }

  create() {
    const start = createVector(random(width), random(height));
    const end = createVector(random(width), random(height));
    const length = p5.Vector.dist(start, end);
    const step = length / MAX_SEGMENTS;
    this.segments = [];
    for (let i = 0; i <= MAX_SEGMENTS; i++) {
      const t = i / MAX_SEGMENTS;
      const pos = p5.Vector.lerp(start, end, t);
      this.segments.push({
        pos: pos.copy(),
        originalPos: pos.copy(),
        speed: random(0.5, 2),
        phase: random(TWO_PI)
      });
    }
  }

  update() {
    for (let i = 0; i < this.segments.length; i++) {
      const seg = this.segments[i];
      const pulse = sin(time * 0.01 + seg.phase) * 0.5 + 0.5;
      const offset = p5.Vector.sub(seg.originalPos, seg.pos);
      seg.pos.add(offset.mult(pulse * 0.1));
    }
  }

  draw() {
    beginShape();
    for (let i = 0; i < this.segments.length; i++) {
      const seg = this.segments[i];
      vertex(seg.pos.x, seg.pos.y);
    }
    endShape();
  }
}

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D().mult(random(0.5, 2));
    this.life = random(100, 300);
    this.size = random(1, 4);
    this.color = color(random(200, 255), random(200, 255), 255, 150);
  }

  update() {
    this.pos.add(this.vel);
    this.life--;
    if (this.life <= 0) {
      this.reset();
    }
  }

  draw() {
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.size);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 255);

  for (let i = 0; i < NUM_LINES; i++) {
    lines.push(new Line());
  }

  for (let i = 0; i < NUM_PARTICLES; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(10, 10, 10, 20);

  time++;

  // Update and draw lines
  for (let line of lines) {
    line.update();
    stroke(line.color);
    strokeWeight(1);
    line.draw();
  }

  // Update and draw particles
  for (let particle of particles) {
    particle.update();
    particle.draw();
  }

  // Occasionally create sparks
  if (frameCount % 30 === 0) {
    const spark = new Particle();
    spark.pos.set(random(width), random(height));
    spark.vel = p5.Vector.random2D().mult(random(1, 4));
    spark.life = random(50, 100);
    spark.size = random(2, 6);
    particles.push(spark);
  }

  // Occasionally break lines
  if (frameCount % 120 === 0) {
    const idx = floor(random(lines.length));
    lines[idx].create();
  }
}
