let wires = [];
let streams = [];
let junctions = [];

class Wire {
  constructor(start, end) {
    this.start = start;
    this.end = end;
    this.segments = [];
    this.buildSegments();
  }

  buildSegments() {
    let segments = 10;
    for (let i = 0; i < segments; i++) {
      let t = i / (segments - 1);
      let pos = p5.Vector.lerp(this.start, this.end, t);
      this.segments.push(pos);
    }
  }

  display() {
    stroke(100, 100, 150, 100);
    strokeWeight(1);
    noFill();
    beginShape();
    for (let p of this.segments) {
      vertex(p.x, p.y);
    }
    endShape();
  }
}

class Stream {
  constructor(from, to) {
    this.from = from;
    this.to = to;
    this.pos = from.copy();
    this.speed = random(0.5, 1.5);
    this.size = random(2, 5);
    this.life = 1;
    this.color = color(random(150, 255), random(150, 255), 255, 200);
  }

  update() {
    let dir = p5.Vector.sub(this.to, this.from);
    let dist = dir.mag();
    dir.normalize();
    this.pos.add(dir.copy().mult(this.speed));
    let currentDist = p5.Vector.dist(this.pos, this.from);
    this.life = map(currentDist, 0, dist, 1, 0);
    if (this.life <= 0) {
      return true;
    }
    return false;
  }

  display() {
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.size * this.life);
  }
}

class Junction {
  constructor(pos) {
    this.pos = pos;
    this.knotSize = 0;
    this.knotGrowth = 0;
    this.active = false;
    this.streams = [];
  }

  update() {
    if (this.active) {
      this.knotGrowth += 0.1;
      this.knotSize = sin(this.knotGrowth) * 20 + 20;
      if (this.knotGrowth > TWO_PI) {
        this.active = false;
        this.knotGrowth = 0;
        // Split streams
        for (let i = 0; i < 5; i++) {
          let angle = random(TWO_PI);
          let dir = p5.Vector.fromAngle(angle);
          let target = p5.Vector.add(this.pos, dir.copy().mult(random(100, 300)));
          streams.push(new Stream(this.pos, target));
        }
      }
    } else {
      this.knotSize *= 0.95;
    }
  }

  display() {
    noStroke();
    fill(255, 200);
    ellipse(this.pos.x, this.pos.y, this.knotSize);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);

  // Create junctions
  for (let i = 0; i < 20; i++) {
    let x = random(width);
    let y = random(height);
    junctions.push(new Junction(createVector(x, y)));
  }

  // Connect junctions with wires
  for (let i = 0; i < junctions.length; i++) {
    for (let j = i + 1; j < junctions.length; j++) {
      let d = p5.Vector.dist(junctions[i].pos, junctions[j].pos);
      if (d < 200) {
        wires.push(new Wire(junctions[i].pos, junctions[j].pos));
      }
    }
  }

  // Add some random wires
  for (let i = 0; i < 30; i++) {
    let start = createVector(random(width), random(height));
    let end = createVector(random(width), random(height));
    wires.push(new Wire(start, end));
  }
}

function draw() {
  background(10, 5, 10);

  // Update and display junctions
  for (let j of junctions) {
    j.update();
    j.display();
  }

  // Update and display streams
  for (let i = streams.length - 1; i >= 0; i--) {
    let s = streams[i];
    if (s.update()) {
      streams.splice(i, 1);
    } else {
      s.display();
    }
  }

  // Occasionally trigger a junction knot
  if (random() < 0.02) {
    let j = random(junctions);
    if (!j.active) {
      j.active = true;
    }
  }

  // Draw wires
  for (let w of wires) {
    w.display();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
