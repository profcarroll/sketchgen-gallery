let streams = [];
let rifts = [];
let time = 0;

class Stream {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.points = [];
    this.length = 150;
    this.hue = random(0, 30); // crimson to orange
    this.saturation = 100;
    this.brightness = 100;
    this.alpha = random(0.4, 0.8);
    this.speed = random(0.2, 0.8);
    
    // Generate initial points
    for (let i = 0; i < this.length; i++) {
      this.points.push({
        x: this.x,
        y: this.y + i * (this.height / this.length)
      });
    }
  }

  update() {
    // Move stream downward
    for (let i = this.points.length - 1; i > 0; i--) {
      this.points[i].x = this.points[i-1].x;
      this.points[i].y = this.points[i-1].y;
    }
    
    // Add some noise to the head point
    let noiseX = noise(this.x * 0.02, time * 0.02) * 30 - 15;
    this.points[0].x = this.x + noiseX;
    this.points[0].y = this.y;
    
    // Move the entire stream
    for (let p of this.points) {
      p.y += this.speed;
    }
    
    // Reset if off screen
    if (this.points[this.points.length - 1].y > height + 50) {
      this.reset();
    }
  }

  reset() {
    this.x = random(width);
    this.y = random(-50, -10);
    this.points = [];
    
    for (let i = 0; i < this.length; i++) {
      this.points.push({
        x: this.x,
        y: this.y + i * (this.height / this.length)
      });
    }
  }

  display() {
    if (this.points.length < 2) return;
    
    noFill();
    stroke(this.hue, this.saturation, this.brightness, this.alpha);
    strokeWeight(1.5);
    beginShape();
    for (let p of this.points) {
      vertex(p.x, p.y);
    }
    endShape();
    
    // Add glow
    stroke(this.hue, this.saturation, 100, this.alpha * 0.3);
    strokeWeight(3);
    beginShape();
    for (let i = 0; i < this.points.length; i++) {
      let p = this.points[i];
      vertex(p.x, p.y);
    }
    endShape();
  }
}

class Rift {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.segments = [];
    this.segmentCount = 15;
    
    for (let i = 0; i < this.segmentCount; i++) {
      this.segments.push({
        x: this.x + random(this.width),
        y: this.y + (i / this.segmentCount) * this.height,
        size: random(3, 8)
      });
    }
  }

  display() {
    noFill();
    stroke(20, 100, 30, 0.6);
    strokeWeight(1);
    
    // Draw the rift as a series of connected segments
    beginShape();
    for (let s of this.segments) {
      vertex(s.x, s.y);
    }
    endShape();
    
    // Add glow to segments
    for (let s of this.segments) {
      fill(20, 100, 100, 0.15);
      noStroke();
      ellipse(s.x, s.y, s.size * 3, s.size * 3);
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create tectonic rifts
  for (let i = 0; i < 4; i++) {
    let w = random(150, 350);
    let h = random(300, 600);
    let x = random(width - w);
    let y = random(height - h);
    rifts.push(new Rift(x, y, w, h));
  }
  
  // Create streams following rifts
  for (let i = 0; i < 25; i++) {
    let r = random(rifts);
    let x = r.x + random(r.width);
    let y = r.y;
    let w = random(40, 80);
    let h = random(300, 500);
    streams.push(new Stream(x, y, w, h));
  }
}

function draw() {
  background(0, 0, 2);
  
  time++;
  
  // Draw rifts
  for (let r of rifts) {
    r.display();
  }
  
  // Update and draw streams
  for (let s of streams) {
    s.update();
    s.display();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
