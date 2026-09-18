let mycelium;
let crystals = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create mycelial network
  mycelium = new Mycelium();

  // Create some crystals
  for (let i = 0; i < 20; i++) {
    crystals.push(new Crystal(random(-width/2, width/2), random(-height/2, height/2)));
  }
}

function draw() {
  background(0);
  time += 0.01;

  // Camera movement
  let cx = sin(time * 0.2) * 300;
  let cy = cos(time * 0.3) * 200;
  let cz = sin(time * 0.1) * 300;
  camera(cx, cy, cz, 0, 0, 0, 0, 1, 0);

  // Draw mycelium
  mycelium.update();
  mycelium.display();

  // Draw crystals
  for (let crystal of crystals) {
    crystal.update();
    crystal.display();
  }
}

class Mycelium {
  constructor() {
    this.segments = [];
    this.maxSegments = 500;
    this.createInitialSegment();
  }

  createInitialSegment() {
    let segment = new Segment(0, 0, 0);
    this.segments.push(segment);
  }

  update() {
    // Add new segments occasionally
    if (this.segments.length < this.maxSegments && random() < 0.1) {
      let last = this.segments[this.segments.length - 1];
      let newSegment = new Segment(
        last.x + random(-20, 20),
        last.y + random(-20, 20),
        last.z + random(-20, 20)
      );
      this.segments.push(newSegment);
    }

    // Update existing segments
    for (let segment of this.segments) {
      segment.update();
    }

    // Remove old segments if too many
    if (this.segments.length > this.maxSegments) {
      this.segments.shift();
    }
  }

  display() {
    beginShape(LINES);
    noFill();
    stroke(100, 50, 90, 0.8);
    for (let i = 0; i < this.segments.length - 1; i++) {
      let s1 = this.segments[i];
      let s2 = this.segments[i+1];
      vertex(s1.x, s1.y, s1.z);
      vertex(s2.x, s2.y, s2.z);
    }
    endShape();
  }
}

class Segment {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.lifespan = 1000;
    this.size = random(5, 15);
    this.growth = random(0.1, 0.5);
  }

  update() {
    this.lifespan--;
    this.x += random(-2, 2);
    this.y += random(-2, 2);
    this.z += random(-2, 2);
    this.size += this.growth;
  }
}

class Crystal {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.z = random(-100, 100);
    this.size = random(20, 50);
    this.rotation = random(TWO_PI);
    this.growth = random(0.01, 0.03);
  }

  update() {
    this.rotation += this.growth;
    this.z += sin(time * 0.5) * 0.5;
  }

  display() {
    push();
    translate(this.x, this.y, this.z);
    rotateZ(this.rotation);
    rotateX(this.rotation * 0.7);
    rotateY(this.rotation * 1.3);

    // Draw crystal
    fill(200, 80, 90, 0.6);
    noStroke();
    for (let i = 0; i < 6; i++) {
      let angle = TWO_PI / 6 * i;
      let x1 = cos(angle) * this.size;
      let y1 = sin(angle) * this.size;
      let x2 = cos(angle + PI/3) * this.size * 0.7;
      let y2 = sin(angle + PI/3) * this.size * 0.7;

      beginShape();
      vertex(0, 0);
      vertex(x1, y1);
      vertex(x2, y2);
      endShape(CLOSE);
    }
    pop();
  }
}
