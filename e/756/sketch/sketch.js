let wires = [];
let streams = [];
let intersections = [];

class Wire {
  constructor(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.length = dist(x1, y1, x2, y2);
    this.angle = atan2(y2 - y1, x2 - x1);
  }

  display() {
    stroke(100, 150, 200, 100);
    strokeWeight(1);
    line(this.x1, this.y1, this.x2, this.y2);
  }
}

class DataStream {
  constructor(wire) {
    this.wire = wire;
    this.progress = 0;
    this.speed = random(0.005, 0.015);
    this.flare = false;
    this.flareTime = 0;
    this.color = color(random(100, 255), random(100, 255), 255, 200);
  }

  update() {
    this.progress += this.speed;
    if (this.progress > 1) this.progress = 0;

    // Check for intersection
    let x = lerp(this.wire.x1, this.wire.x2, this.progress);
    let y = lerp(this.wire.y1, this.wire.y2, this.progress);

    for (let i = 0; i < intersections.length; i++) {
      let inter = intersections[i];
      if (dist(x, y, inter.x, inter.y) < 15) {
        this.flare = true;
        this.flareTime = millis();
      }
    }

    if (this.flare && millis() - this.flareTime > 100) {
      this.flare = false;
    }
  }

  display() {
    let x = lerp(this.wire.x1, this.wire.x2, this.progress);
    let y = lerp(this.wire.y1, this.wire.y2, this.progress);

    if (this.flare) {
      noStroke();
      fill(255, 255, 200, 150);
      ellipse(x, y, 20, 20);
    }

    noStroke();
    fill(this.color);
    ellipse(x, y, 6, 6);
  }
}

function setup() {
  createCanvas(800, 600);

  // Create wires
  for (let i = 0; i < 100; i++) {
    let x1 = random(width);
    let y1 = random(height);
    let x2 = random(width);
    let y2 = random(height);
    wires.push(new Wire(x1, y1, x2, y2));
  }

  // Create intersections
  for (let i = 0; i < 30; i++) {
    let x = random(width);
    let y = random(height);
    intersections.push({x, y});
  }

  // Create data streams
  for (let i = 0; i < 20; i++) {
    let wire = random(wires);
    streams.push(new DataStream(wire));
  }
}

function draw() {
  background(10, 15, 30);

  // Display wires
  for (let wire of wires) {
    wire.display();
  }

  // Display intersections
  noStroke();
  fill(255, 255, 200, 50);
  for (let inter of intersections) {
    ellipse(inter.x, inter.y, 10, 10);
  }

  // Update and display streams
  for (let stream of streams) {
    stream.update();
    stream.display();
  }
}
