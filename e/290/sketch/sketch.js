let cables = [];
let streams = [];
let junctions = [];

class Cable {
  constructor(start, end) {
    this.start = start;
    this.end = end;
    this.segments = [];
    this.streams = [];
    this.createSegments();
  }

  createSegments() {
    let dir = p5.Vector.sub(this.end, this.start);
    let len = dir.mag();
    dir.normalize();
    let numSegs = floor(len / 10);
    for (let i = 0; i < numSegs; i++) {
      let pos = p5.Vector.add(this.start, p5.Vector.mult(dir, i * 10));
      this.segments.push(pos);
    }
  }

  display() {
    stroke(100, 150, 200, 100);
    strokeWeight(1);
    noFill();
    beginShape();
    for (let seg of this.segments) {
      vertex(seg.x, seg.y, seg.z);
    }
    endShape();
    
    // Draw streams
    for (let stream of this.streams) {
      let pos = stream.pos;
      stroke(255, 255, 0, 200);
      strokeWeight(2);
      point(pos.x, pos.y, pos.z);
    }
  }

  update() {
    // Move streams along cables
    for (let i = this.streams.length - 1; i >= 0; i--) {
      let stream = this.streams[i];
      stream.update();
      if (stream.isDone()) {
        this.streams.splice(i, 1);
      }
    }
    
    // Add new streams occasionally
    if (random() < 0.02) {
      this.streams.push(new Stream(this));
    }
  }
}

class Stream {
  constructor(cable) {
    this.cable = cable;
    this.pos = cable.segments[0].copy();
    this.speed = random(0.5, 1.5);
    this.t = 0;
    this.maxT = cable.segments.length - 1;
    this.size = random(2, 4);
  }

  update() {
    this.t += this.speed;
    if (this.t >= this.maxT) {
      this.t = 0;
    }
    
    let idx = floor(this.t);
    let nextIdx = idx + 1;
    if (nextIdx < this.cable.segments.length) {
      let t = this.t - idx;
      let pos = p5.Vector.lerp(this.cable.segments[idx], this.cable.segments[nextIdx], t);
      this.pos = pos.copy();
    }
  }

  isDone() {
    return this.t >= this.maxT;
  }

  display() {
    stroke(255, 255, 0, 200);
    strokeWeight(this.size);
    point(this.pos.x, this.pos.y, this.pos.z);
  }
}

class Junction {
  constructor(pos) {
    this.pos = pos;
    this.pulse = 0;
    this.pulseSpeed = random(0.02, 0.05);
    this.streams = [];
  }

  update() {
    this.pulse += this.pulseSpeed;
    if (this.pulse > TWO_PI) this.pulse = 0;

    // Split streams at junction
    if (random() < 0.01) {
      let angle = random(TWO_PI);
      let dir = p5.Vector.fromAngle(angle, 100);
      this.streams.push(new SplitStream(this.pos.copy(), dir));
    }

    for (let i = this.streams.length - 1; i >= 0; i--) {
      let stream = this.streams[i];
      stream.update();
      if (stream.isDone()) {
        this.streams.splice(i, 1);
      }
    }
  }

  display() {
    // Glow at junction
    let pulseSize = 10 + sin(this.pulse) * 5;
    noStroke();
    fill(255, 255, 0, 100);
    sphere(pulseSize);

    // Draw streams
    for (let stream of this.streams) {
      stream.display();
    }
  }
}

class SplitStream {
  constructor(start, dir) {
    this.pos = start.copy();
    this.dir = dir.copy();
    this.speed = random(2, 5);
    this.size = random(1, 3);
    this.life = 0;
    this.maxLife = random(50, 100);
  }

  update() {
    this.pos.add(p5.Vector.mult(this.dir, this.speed));
    this.life++;
  }

  isDone() {
    return this.life > this.maxLife;
  }

  display() {
    stroke(255, 255, 0, 200);
    strokeWeight(this.size);
    point(this.pos.x, this.pos.y, this.pos.z);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create junctions
  for (let i = 0; i < 20; i++) {
    let x = random(-width/2 + 50, width/2 - 50);
    let y = random(-height/2 + 50, height/2 - 50);
    let z = random(-100, 100);
    junctions.push(new Junction(createVector(x, y, z)));
  }

  // Create cables
  for (let i = 0; i < 100; i++) {
    let start = createVector(
      random(-width/2 + 50, width/2 - 50),
      random(-height/2 + 50, height/2 - 50),
      random(-100, 100)
    );
    let end = createVector(
      random(-width/2 + 50, width/2 - 50),
      random(-height/2 + 50, height/2 - 50),
      random(-100, 100)
    );
    cables.push(new Cable(start, end));
  }
}

function draw() {
  background(0);
  noStroke();
  fill(0, 0, 0, 0.05);
  sphere(width);

  // Update and display junctions
  for (let j of junctions) {
    j.update();
    j.display();
  }

  // Update and display cables
  for (let c of cables) {
    c.update();
    c.display();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
