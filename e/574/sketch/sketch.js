let lines = [];
let residues = [];
let time = 0;

class Line {
  constructor() {
    this.points = [];
    this.color = color(random(100, 255), random(100, 255), random(255), 200);
    this.init();
  }

  init() {
    const start = createVector(random(width), random(height));
    const end = createVector(random(width), random(height));
    this.points = [start, end];
  }

  update() {
    // Slight movement to simulate flow
    for (let p of this.points) {
      p.x += random(-0.5, 0.5);
      p.y += random(-0.5, 0.5);
    }
  }

  draw() {
    stroke(this.color);
    strokeWeight(1);
    noFill();
    beginShape();
    for (let p of this.points) {
      vertex(p.x, p.y);
    }
    endShape();
  }

  break() {
    // Create a break point
    const idx = floor(random(1, this.points.length - 1));
    const pos = this.points[idx];
    residues.push({
      pos: pos.copy(),
      color: this.color,
      life: 1.0
    });
    // Remove the segment at that index
    this.points.splice(idx, 1);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB);
  noFill();
  for (let i = 0; i < 20; i++) {
    lines.push(new Line());
  }
}

function draw() {
  background(10, 10, 20, 20);

  time += 0.01;
  
  // Update and draw all lines
  for (let line of lines) {
    line.update();
    line.draw();
  }

  // Occasionally break a line
  if (random() < 0.02) {
    const idx = floor(random(lines.length));
    lines[idx].break();
  }

  // Draw and update residues
  for (let i = residues.length - 1; i >= 0; i--) {
    let r = residues[i];
    stroke(red(r.color), green(r.color), blue(r.color), r.life * 255);
    strokeWeight(3);
    point(r.pos.x, r.pos.y);
    
    r.life -= 0.01;
    if (r.life <= 0) {
      residues.splice(i, 1);
    }
  }

  // Occasionally add new lines
  if (random() < 0.01 && lines.length < 30) {
    lines.push(new Line());
  }

  // Occasionally remove old lines
  if (lines.length > 25 && random() < 0.01) {
    lines.splice(0, 1);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
