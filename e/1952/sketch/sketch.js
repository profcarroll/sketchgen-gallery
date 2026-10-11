let streams = [];
let junctions = [];
let shards = [];

class Stream {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(0.5, 2));
    this.size = random(1, 3);
    this.color = color(255, 255, 255, 200);
    this.life = 1;
    this.segments = [];
    this.maxSegments = 15;
  }

  update() {
    this.pos.add(this.vel);
    this.life -= 0.003;

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
    this.radius = random(15, 30);
  }

  display() {
    noFill();
    stroke(255, 255, 255, 180);
    strokeWeight(1);
    ellipse(this.pos.x, this.pos.y, this.radius * 2);
  }
}

class Shard {
  constructor(x, y, angle) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.fromAngle(angle).mult(random(2, 6));
    this.life = 1;
    this.size = random(2, 8);
  }

  update() {
    this.pos.add(this.vel);
    this.life -= 0.02;
  }

  display() {
    noFill();
    stroke(255, 255, 255, 180);
    strokeWeight(this.size * this.life);
    line(this.pos.x, this.pos.y, this.pos.x - this.vel.x * 5, this.pos.y - this.vel.y * 5);
  }

  isDead() {
    return this.life <= 0;
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB);

  // Create main network
  for (let i = 0; i < 30; i++) {
    let x = random(width);
    let y = random(height);
    streams.push(new Stream(x, y));
  }

  // Create junctions
  for (let i = 0; i < 10; i++) {
    let x = random(width);
    let y = random(height);
    junctions.push(new Junction(x, y));
  }
}

function draw() {
  background(10, 10, 10);

  // Update and display junctions
  for (let j of junctions) {
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

  // Check for junction collisions and create shards
  for (let i = streams.length - 1; i >= 0; i--) {
    let s = streams[i];
    for (let j of junctions) {
      let d = dist(s.pos.x, s.pos.y, j.pos.x, j.pos.y);
      if (d < j.radius + 20) {
        // Create shards
        for (let k = 0; k < 15; k++) {
          let angle = random(TWO_PI);
          shards.push(new Shard(j.pos.x, j.pos.y, angle));
        }
        streams.splice(i, 1);
        break;
      }
    }
  }

  // Update and display shards
  for (let i = shards.length - 1; i >= 0; i--) {
    let shard = shards[i];
    shard.update();
    shard.display();

    if (shard.isDead()) {
      shards.splice(i, 1);
    }
  }

  // Draw network connections between streams
  stroke(255, 255, 255, 40);
  strokeWeight(0.3);
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
