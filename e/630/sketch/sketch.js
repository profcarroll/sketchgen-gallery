let streams = [];
let junctions = [];
let secondaryStreams = [];

class Stream {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(0.5, 2));
    this.size = random(2, 6);
    this.color = color(100, 200, 255, 150);
    this.life = 1;
    this.segments = [];
    this.maxSegments = 20;
  }

  update() {
    this.pos.add(this.vel);
    this.life -= 0.005;

    // Add current position to segments
    this.segments.push(this.pos.copy());
    if (this.segments.length > this.maxSegments) {
      this.segments.shift();
    }
  }

  display() {
    noFill();
    stroke(this.color);
    strokeWeight(this.size * this.life);
    beginShape();
    for (let i = 0; i < this.segments.length; i++) {
      let alpha = map(i, 0, this.segments.length, 0, 1) * this.life;
      stroke(red(this.color), green(this.color), blue(this.color), alpha * 255);
      vertex(this.segments[i].x, this.segments[i].y);
    }
    endShape();
  }

  isDead() {
    return this.life <= 0;
  }
}

class Junction {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.radius = random(10, 25);
    this.pulse = 0;
    this.pulseDirection = 1;
  }

  update() {
    this.pulse += 0.03 * this.pulseDirection;
    if (this.pulse > 1) {
      this.pulse = 1;
      this.pulseDirection = -1;
    } else if (this.pulse < 0) {
      this.pulse = 0;
      this.pulseDirection = 1;
    }
  }

  display() {
    noFill();
    stroke(255, 200);
    strokeWeight(this.radius * (0.5 + this.pulse * 0.5));
    ellipse(this.pos.x, this.pos.y, this.radius * 2 * (0.5 + this.pulse * 0.5));
  }
}

class SecondaryStream {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.angle = random(TWO_PI);
    this.speed = random(1, 3);
    this.growth = random(0.01, 0.03);
    this.size = 0;
    this.color = color(255, 100, 100, 180);
    this.life = 1;
  }

  update() {
    this.angle += 0.05;
    this.size += this.growth;
    this.pos.x += cos(this.angle) * this.speed;
    this.pos.y += sin(this.angle) * this.speed;
    this.life -= 0.01;
  }

  display() {
    noFill();
    stroke(this.color);
    strokeWeight(2 * this.life);
    ellipse(this.pos.x, this.pos.y, this.size * this.life);
  }

  isDead() {
    return this.life <= 0 || this.size > 200;
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);

  // Create main network
  for (let i = 0; i < 50; i++) {
    let x = random(width);
    let y = random(height);
    streams.push(new Stream(x, y));
  }

  // Create junctions
  for (let i = 0; i < 8; i++) {
    let x = random(width);
    let y = random(height);
    junctions.push(new Junction(x, y));
  }
}

function draw() {
  background(10, 10, 10);

  // Update and display junctions
  for (let j of junctions) {
    j.update();
    j.display();
  }

  // Update and display streams
  for (let i = streams.length - 1; i >= 0; i--) {
    let s = streams[i];
    s.update();
    s.display();

    if (s.isDead()) {
      streams.splice(i, 1);
      // Create new stream at random location
      streams.push(new Stream(random(width), random(height)));
    }
  }

  // Check for junction collisions and spawn secondary streams
  for (let i = streams.length - 1; i >= 0; i--) {
    let s = streams[i];
    for (let j of junctions) {
      let d = dist(s.pos.x, s.pos.y, j.pos.x, j.pos.y);
      if (d < j.radius + 20) {
        secondaryStreams.push(new SecondaryStream(j.pos.x, j.pos.y));
      }
    }
  }

  // Update and display secondary streams
  for (let i = secondaryStreams.length - 1; i >= 0; i--) {
    let ss = secondaryStreams[i];
    ss.update();
    ss.display();

    if (ss.isDead()) {
      secondaryStreams.splice(i, 1);
    }
  }

  // Draw network connections between streams
  stroke(50, 30, 40, 100);
  strokeWeight(0.5);
  noFill();
  for (let i = 0; i < streams.length - 1; i++) {
    let s1 = streams[i];
    let s2 = streams[i + 1];
    if (s1 && s2) {
      line(s1.pos.x, s1.pos.y, s2.pos.x, s2.pos.y);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
