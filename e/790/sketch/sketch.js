let lines = [];
let points = [];
let residuePoints = [];
const NUM_LINES = 150;
const NUM_POINTS = 300;
const RESIDUE_COUNT = 200;
const MAX_DEPTH = 10;

class Line {
  constructor() {
    this.start = createVector(random(width), random(height));
    this.end = createVector(random(width), random(height));
    this.segments = [];
    this.buildSegments();
  }

  buildSegments() {
    const steps = floor(dist(this.start.x, this.start.y, this.end.x, this.end.y) / 10);
    this.segments = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = lerp(this.start.x, this.end.x, t);
      const y = lerp(this.start.y, this.end.y, t);
      this.segments.push(createVector(x, y));
    }
  }

  update() {
    if (random() < 0.01) {
      this.start.add(random(-5, 5), random(-5, 5));
      this.end.add(random(-5, 5), random(-5, 5));
      this.buildSegments();
    }
  }

  display() {
    stroke(255, 100);
    noFill();
    beginShape();
    for (let p of this.segments) {
      vertex(p.x, p.y);
    }
    endShape();
  }
}

class Point {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.life = random(50, 100);
  }

  update() {
    this.life--;
  }

  display() {
    const alpha = map(this.life, 0, 100, 0, 255);
    fill(255, alpha);
    noStroke();
    ellipse(this.pos.x, this.pos.y, 3);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noCursor();

  for (let i = 0; i < NUM_LINES; i++) {
    lines.push(new Line());
  }

  for (let i = 0; i < NUM_POINTS; i++) {
    points.push(createVector(random(width), random(height)));
  }

  for (let i = 0; i < RESIDUE_COUNT; i++) {
    residuePoints.push(new Point(random(width), random(height)));
  }
}

function draw() {
  background(0, 0, 0, 0.1);

  // Update and display lines
  for (let line of lines) {
    line.update();
    line.display();
  }

  // Update and display residue points
  for (let i = residuePoints.length - 1; i >= 0; i--) {
    const p = residuePoints[i];
    p.update();
    if (p.life <= 0) {
      residuePoints.splice(i, 1);
    } else {
      p.display();
    }
  }

  // Create new residue points occasionally
  if (random() < 0.2 && residuePoints.length < RESIDUE_COUNT * 1.5) {
    const pos = createVector(random(width), random(height));
    residuePoints.push(new Point(pos.x, pos.y));
  }

  // Connect lines to nearby residue points
  stroke(255, 0.1);
  noFill();
  beginShape(LINES);
  for (let line of lines) {
    for (let point of residuePoints) {
      const d = dist(line.start.x, line.start.y, point.pos.x, point.pos.y);
      if (d < 100) {
        vertex(line.start.x, line.start.y);
        vertex(point.pos.x, point.pos.y);
      }
    }
  }
  endShape();
}
