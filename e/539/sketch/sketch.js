let wires = [];
let streams = [];
let nodes = [];

class Wire {
  constructor(start, end) {
    this.start = start;
    this.end = end;
    this.length = p5.Vector.dist(this.start, this.end);
    this.segments = [];
    this.generateSegments();
  }

  generateSegments() {
    const segmentCount = floor(this.length / 10);
    for (let i = 0; i <= segmentCount; i++) {
      const t = i / segmentCount;
      const pos = p5.Vector.lerp(this.start, this.end, t);
      this.segments.push(pos);
    }
  }

  display() {
    stroke(150, 150, 200, 100);
    strokeWeight(0.5);
    noFill();
    beginShape();
    for (let seg of this.segments) {
      vertex(seg.x, seg.y, seg.z);
    }
    endShape();
  }
}

class Stream {
  constructor(startPos, wireIndex) {
    this.pos = startPos.copy();
    this.wireIndex = wireIndex;
    this.progress = 0;
    this.speed = random(0.5, 1.5);
    this.radius = random(2, 4);
    this.color = color(random(150, 255), random(150, 255), 255, 200);
    this.active = true;
  }

  update() {
    if (!this.active) return;
    this.progress += this.speed / 100;
    if (this.progress > 1) {
      this.active = false;
      return;
    }
    const wire = wires[this.wireIndex];
    if (wire && wire.segments.length > 0) {
      const index = floor(this.progress * (wire.segments.length - 1));
      if (index < wire.segments.length) {
        this.pos = wire.segments[index].copy();
      }
    }
  }

  display() {
    if (!this.active) return;
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    noStroke();
    fill(this.color);
    sphere(this.radius);
    pop();
  }
}

class Node {
  constructor(pos) {
    this.pos = pos.copy();
    this.life = random(30, 60);
    this.maxLife = this.life;
    this.color = color(random(200, 255), random(150, 255), 100, 200);
    this.size = random(8, 12);
  }

  update() {
    this.life--;
  }

  display() {
    if (this.life <= 0) return;
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    noStroke();
    fill(this.color);
    sphere(this.size);
    pop();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  frameRate(30);

  // Create a network of wires
  for (let i = 0; i < 100; i++) {
    const start = createVector(random(-width/2, width/2), random(-height/2, height/2), random(-100, 100));
    const end = createVector(random(-width/2, width/2), random(-height/2, height/2), random(-100, 100));
    wires.push(new Wire(start, end));
  }

  // Add some more connections between points to make it more tangled
  for (let i = 0; i < 50; i++) {
    const start = createVector(random(-width/2, width/2), random(-height/2, height/2), random(-100, 100));
    const end = createVector(random(-width/2, width/2), random(-height/2, height/2), random(-100, 100));
    wires.push(new Wire(start, end));
  }

  // Add some center nodes to simulate junctions
  for (let i = 0; i < 15; i++) {
    const pos = createVector(0, 0, random(-100, 100));
    nodes.push(new Node(pos));
  }
}

function draw() {
  background(0);
  orbitControl();

  // Draw wires
  for (let wire of wires) {
    wire.display();
  }

  // Update and display streams
  for (let i = streams.length - 1; i >= 0; i--) {
    streams[i].update();
    streams[i].display();
    if (!streams[i].active) {
      streams.splice(i, 1);
    }
  }

  // Occasionally spawn new streams from center
  if (frameCount % 30 === 0 && random() > 0.7) {
    const wireIndex = floor(random(wires.length));
    const wire = wires[wireIndex];
    if (wire && wire.segments.length > 0) {
      const start = wire.segments[0].copy();
      streams.push(new Stream(start, wireIndex));
    }
  }

  // Update and display nodes
  for (let i = nodes.length - 1; i >= 0; i--) {
    nodes[i].update();
    nodes[i].display();
    if (nodes[i].life <= 0) {
      nodes.splice(i, 1);
    }
  }

  // Occasionally create new nodes at junctions
  if (frameCount % 60 === 0 && random() > 0.5) {
    const wire = wires[floor(random(wires.length))];
    if (wire && wire.segments.length > 0) {
      const index = floor(random(wire.segments.length));
      nodes.push(new Node(wire.segments[index]));
    }
  }

  // Periodically split streams
  if (frameCount % 120 === 0 && streams.length > 0) {
    const streamIndex = floor(random(streams.length));
    const stream = streams[streamIndex];
    if (stream && random() > 0.5) {
      const newStream = new Stream(stream.pos, stream.wireIndex);
      newStream.speed *= 1.5;
      streams.push(newStream);
    }
  }

  // Add a few more streams occasionally to keep things lively
  if (frameCount % 20 === 0 && random() > 0.8) {
    const wireIndex = floor(random(wires.length));
    const wire = wires[wireIndex];
    if (wire && wire.segments.length > 0) {
      const start = wire.segments[0].copy();
      streams.push(new Stream(start, wireIndex));
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
