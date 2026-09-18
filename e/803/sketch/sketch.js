let splines = [];
let shards = [];
let tensionLines = [];

class Spline {
  constructor() {
    this.points = [];
    this.color = color(random(100, 255), random(100, 255), random(100, 255), 150);
    this.init();
  }

  init() {
    this.points = [];
    let startAngle = random(TWO_PI);
    let radius = random(50, 150);
    for (let i = 0; i < 8; i++) {
      let angle = startAngle + (i / 8) * TWO_PI;
      let x = width/2 + cos(angle) * radius;
      let y = height/2 + sin(angle) * radius;
      this.points.push(createVector(x, y));
    }
  }

  update() {
    for (let i = 0; i < this.points.length; i++) {
      let p = this.points[i];
      p.x += random(-1, 1);
      p.y += random(-1, 1);
    }
  }

  draw() {
    noFill();
    stroke(this.color);
    strokeWeight(2);
    beginShape();
    for (let p of this.points) {
      curveVertex(p.x, p.y);
    }
    endShape(CLOSE);
  }
}

class Shard {
  constructor() {
    this.start = createVector(random(width), random(height));
    this.end = createVector(random(width), random(height));
    this.color = color(255, 255, 255, 200);
  }

  update() {
    // Move shards slightly
    this.start.x += random(-0.5, 0.5);
    this.start.y += random(-0.5, 0.5);
    this.end.x += random(-0.5, 0.5);
    this.end.y += random(-0.5, 0.5);

    // Keep within canvas
    this.start.x = constrain(this.start.x, 0, width);
    this.start.y = constrain(this.start.y, 0, height);
    this.end.x = constrain(this.end.x, 0, width);
    this.end.y = constrain(this.end.y, 0, height);
  }

  draw() {
    stroke(this.color);
    strokeWeight(1);
    line(this.start.x, this.start.y, this.end.x, this.end.y);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);

  // Create splines
  for (let i = 0; i < 8; i++) {
    splines.push(new Spline());
  }

  // Create shards
  for (let i = 0; i < 15; i++) {
    shards.push(new Shard());
  }
}

function draw() {
  background(0);

  // Update and draw splines
  for (let s of splines) {
    s.update();
    s.draw();
  }

  // Update and draw shards
  for (let sh of shards) {
    sh.update();
    sh.draw();
  }

  // Generate tension lines
  tensionLines = [];
  for (let i = 0; i < splines.length; i++) {
    let s1 = splines[i];
    for (let j = i + 1; j < splines.length; j++) {
      let s2 = splines[j];
      // Find closest points between two splines
      for (let p1 of s1.points) {
        for (let p2 of s2.points) {
          let d = dist(p1.x, p1.y, p2.x, p2.y);
          if (d < 50) {
            tensionLines.push({
              x1: p1.x,
              y1: p1.y,
              x2: p2.x,
              y2: p2.y,
              strength: map(d, 0, 50, 1, 0.2)
            });
          }
        }
      }
    }
  }

  // Draw tension lines
  stroke(255, 150);
  strokeWeight(0.5);
  for (let t of tensionLines) {
    line(t.x1, t.y1, t.x2, t.y2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
