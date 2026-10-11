let spirals = [];
let streams = [];

class SpiralChamber {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.rotation = random(TWO_PI);
    this.segments = [];
    this.generateSegments();
  }

  generateSegments() {
    let points = 80;
    for (let i = 0; i < points; i++) {
      let angle = map(i, 0, points, 0, TWO_PI * 4);
      let radius = map(i, 0, points, this.size * 0.3, this.size * 0.8);
      let px = this.x + cos(angle + this.rotation) * radius;
      let py = this.y + sin(angle + this.rotation) * radius;
      this.segments.push({x: px, y: py});
    }
  }

  display() {
    noFill();
    stroke(180, 50, 80, 0.3);
    strokeWeight(1);
    beginShape();
    for (let s of this.segments) {
      vertex(s.x, s.y);
    }
    endShape(CLOSE);
  }
}

class DataStream {
  constructor() {
    this.reset();
  }

  reset() {
    this.points = [];
    this.length = int(random(30, 80));
    this.x = random(width);
    this.y = random(height);
    this.hue = random(160, 190); // cyan to emerald
    this.alpha = random(0.2, 0.7);
    this.speed = random(0.5, 1.5);
    this.pulse = 0;
    this.growth = random(0.01, 0.03);
    
    for (let i = 0; i < this.length; i++) {
      this.points.push({x: this.x, y: this.y});
    }
  }

  update() {
    this.pulse += 0.05;
    
    // Move stream along spiral path
    let angle = map(frameCount * 0.01, 0, 1, 0, TWO_PI * 2);
    let radius = map(frameCount * 0.01, 0, 1, 0, 300);
    
    this.x += cos(angle) * this.speed;
    this.y += sin(angle) * this.speed;
    
    // Update points
    for (let i = this.points.length - 1; i > 0; i--) {
      this.points[i].x = this.points[i-1].x;
      this.points[i].y = this.points[i-1].y;
    }
    
    this.points[0].x = this.x;
    this.points[0].y = this.y;
    
    // Reset if off screen or expired
    if (frameCount % 300 === 0 || 
        this.x < -100 || this.x > width + 100 ||
        this.y < -100 || this.y > height + 100) {
      this.reset();
    }
  }

  display() {
    if (this.points.length < 2) return;
    
    noFill();
    stroke(this.hue, 100, 90, this.alpha);
    strokeWeight(1);
    beginShape();
    for (let p of this.points) {
      vertex(p.x, p.y);
    }
    endShape();
    
    // Add glow
    stroke(this.hue, 100, 100, this.alpha * 0.3);
    strokeWeight(2);
    beginShape();
    for (let i = 0; i < this.points.length; i++) {
      let p = this.points[i];
      vertex(p.x, p.y);
    }
    endShape();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create spiral chambers
  for (let i = 0; i < 8; i++) {
    let x = random(width * 0.2, width * 0.8);
    let y = random(height * 0.2, height * 0.8);
    let size = random(150, 300);
    spirals.push(new SpiralChamber(x, y, size));
  }
  
  // Create data streams
  for (let i = 0; i < 20; i++) {
    streams.push(new DataStream());
  }
}

function draw() {
  background(0, 0, 5);
  
  // Draw spiral chambers
  for (let s of spirals) {
    s.display();
  }
  
  // Draw data streams
  for (let stream of streams) {
    stream.update();
    stream.display();
  }
  
  // Add subtle pulsing effect to background
  let pulse = sin(frameCount * 0.02) * 0.1 + 0.9;
  fill(0, 0, 10, pulse * 0.1);
  noStroke();
  rect(0, 0, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
