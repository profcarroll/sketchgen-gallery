let streams = [];
let numStreams = 15;
let numPointsPerStream = 200;
let particles = [];
let sparkles = [];

class Stream {
  constructor() {
    this.points = [];
    this.color = color(
      random(100, 255),
      random(100, 255),
      random(200, 255),
      200
    );
    this.generatePath();
  }

  generatePath() {
    let angle = random(TWO_PI);
    let radius = random(50, 150);
    let heightOffset = random(-100, 100);

    for (let i = 0; i < numPointsPerStream; i++) {
      let t = map(i, 0, numPointsPerStream - 1, 0, TWO_PI * 3);
      let x = cos(angle + t) * radius;
      let y = sin(angle + t) * radius;
      let z = t * 20 + heightOffset;

      this.points.push(createVector(x, y, z));
    }
  }

  display() {
    push();
    stroke(this.color);
    noFill();
    beginShape();
    for (let p of this.points) {
      vertex(p.x, p.y, p.z);
    }
    endShape();
    pop();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  frameRate(30);

  for (let i = 0; i < numStreams; i++) {
    streams.push(new Stream());
  }

  // Initialize particles
  for (let i = 0; i < 1000; i++) {
    let p = createVector(
      random(-width / 2, width / 2),
      random(-height / 2, height / 2),
      random(-500, 500)
    );
    particles.push(p);
  }
}

function draw() {
  background(0);

  // Rotate the scene
  rotateY(frameCount * 0.002);
  rotateX(sin(frameCount * 0.001) * 0.1);

  // Draw streams
  for (let stream of streams) {
    stream.display();
  }

  // Draw particles
  push();
  noStroke();
  fill(255, 200);
  beginShape(POINTS);
  for (let p of particles) {
    vertex(p.x, p.y, p.z);
  }
  endShape();

  // Draw sparkles
  for (let i = sparkles.length - 1; i >= 0; i--) {
    let s = sparkles[i];
    s.update();
    s.display();
    if (s.isDead()) {
      sparkles.splice(i, 1);
    }
  }

  pop();

  // Add new sparkles at stream edges
  for (let stream of streams) {
    if (random() < 0.1) {
      let idx = floor(random(stream.points.length));
      let pos = stream.points[idx];
      sparkles.push(new Sparkle(pos.x, pos.y, pos.z));
    }
  }

  // Move particles slightly
  for (let p of particles) {
    p.x += random(-0.5, 0.5);
    p.y += random(-0.5, 0.5);
    p.z += random(-0.5, 0.5);
  }
}

class Sparkle {
  constructor(x, y, z) {
    this.pos = createVector(x, y, z);
    this.vel = p5.Vector.random3D().mult(random(1, 3));
    this.life = 255;
    this.size = random(1, 3);
  }

  update() {
    this.pos.add(this.vel);
    this.life -= 5;
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    noStroke();
    fill(255, 255, 200, this.life);
    sphere(this.size);
    pop();
  }

  isDead() {
    return this.life <= 0;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
