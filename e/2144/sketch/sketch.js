let lines = [];
let nodes = [];
let frameCount = 0;

class Line {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.vx = random(-0.5, 0.5);
    this.vy = random(-0.5, 0.5);
    this.length = random(30, 100);
    this.angle = random(TWO_PI);
    this.speed = random(0.01, 0.03);
    this.pulse = 0;
    this.color = color(random(100, 255), random(50, 150), random(0, 50));
    this.segments = [];
    this.segmentCount = floor(random(3, 8));
    for (let i = 0; i < this.segmentCount; i++) {
      this.segments.push({
        x: random(-this.length/2, this.length/2),
        y: random(-this.length/4, this.length/4)
      });
    }
    // For afterglow
    this.history = [];
    this.maxHistory = 20;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.angle += this.speed;
    this.pulse = (sin(frameCount * 0.03) + 1) / 2;

    // Wrap around edges
    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;
    
    // Update history for afterglow
    this.history.push({x: this.x, y: this.y});
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);

    // Draw afterglow trail
    noFill();
    stroke(this.color);
    strokeWeight(0.5);
    beginShape();
    for (let i = 0; i < this.history.length; i++) {
      let h = this.history[i];
      let alpha = map(i, 0, this.history.length - 1, 0, 100);
      stroke(red(this.color), green(this.color), blue(this.color), alpha);
      vertex(h.x - this.x, h.y - this.y);
    }
    endShape();

    // Draw segments
    for (let i = 0; i < this.segments.length - 1; i++) {
      let s1 = this.segments[i];
      let s2 = this.segments[i+1];
      
      // Apply oscillation when near a node
      let minDist = Infinity;
      for (let node of nodes) {
        let d = dist(s1.x, s1.y, node.x - this.x, node.y - this.y);
        if (d < minDist) minDist = d;
      }
      
      if (minDist < 60) {
        let oscillation = sin(frameCount * 0.1 + minDist * 0.1) * 3;
        stroke(this.color);
        strokeWeight(1 + this.pulse * 2);
        line(s1.x, s1.y + oscillation, s2.x, s2.y + oscillation);
      } else {
        stroke(this.color);
        strokeWeight(1 + this.pulse * 2);
        line(s1.x, s1.y, s2.x, s2.y);
      }
    }
    
    pop();
  }
}

class Node {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(8, 20);
    this.color = color(random(200, 255), random(0, 50), random(0, 50)); // Red or green
    this.pulse = 0;
    this.type = random() > 0.5 ? 'red' : 'green';
  }

  display() {
    this.pulse = (sin(frameCount * 0.05) + 1) / 2;
    
    fill(this.color);
    noStroke();
    ellipse(this.x, this.y, this.size + this.pulse * 5);
    
    // Draw a glow
    noFill();
    stroke(this.color);
    strokeWeight(3);
    ellipse(this.x, this.y, this.size * 2 + this.pulse * 10);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);

  // Create lines
  for (let i = 0; i < 80; i++) {
    lines.push(new Line());
  }

  // Create nodes
  for (let i = 0; i < 15; i++) {
    nodes.push(new Node());
  }
}

function draw() {
  background(10, 10, 20);
  
  // Update and display lines
  for (let line of lines) {
    line.update();
    line.display();
  }

  // Display nodes
  for (let node of nodes) {
    node.display();
  }
  
  frameCount++;
}
