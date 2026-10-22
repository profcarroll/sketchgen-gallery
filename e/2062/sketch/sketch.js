let streams = [];
let particles = [];
let slate;

function setup() {
  createCanvas(windowWidth, windowHeight);
  slate = createGraphics(width, height);
  slate.background(30, 40, 50);
  
  // Create initial mineral streams
  for (let i = 0; i < 10; i++) {
    streams.push(new Stream());
  }
}

function draw() {
  // Draw the slate surface with texture
  image(slate, 0, 0);
  
  // Update and display streams
  for (let stream of streams) {
    stream.update();
    stream.display();
  }
  
  // Add new particles occasionally to simulate continuous flow
  if (frameCount % 5 === 0 && particles.length < 300) {
    particles.push(new Particle());
  }
  
  // Update and display particles
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    
    // Remove dead particles
    if (particles[i].isDead()) {
      particles.splice(i, 1);
    }
  }
}

class Stream {
  constructor() {
    this.x = random(width);
    this.y = -20;
    this.segments = [];
    this.maxSegments = 20;
    this.speed = random(0.5, 1.5);
    this.color = color(220, 230, 240);
    this.width = random(2, 6);
  }
  
  update() {
    // Move stream downward
    this.y += this.speed;
    
    // Add new segment
    this.segments.push({
      x: this.x,
      y: this.y,
      width: this.width
    });
    
    // Remove old segments if needed
    if (this.segments.length > this.maxSegments) {
      this.segments.shift();
    }
    
    // Occasionally change direction slightly
    if (frameCount % 30 === 0) {
      this.x += random(-2, 2);
    }
  }
  
  display() {
    noFill();
    stroke(this.color);
    strokeWeight(this.width);
    beginShape();
    for (let segment of this.segments) {
      curveVertex(segment.x, segment.y);
    }
    endShape();
  }
}

class Particle {
  constructor() {
    this.reset();
    this.size = random(1, 3);
    this.color = color(240, 245, 250);
    this.lifespan = random(100, 200);
  }
  
  reset() {
    this.x = random(width);
    this.y = -10;
    this.vx = random(-0.5, 0.5);
    this.vy = random(1, 3);
    this.alpha = 255;
    this.lifespan = random(100, 200);
  }
  
  update() {
    // Apply gravity
    this.vy += 0.05;
    
    // Apply some lateral drift
    this.vx += random(-0.05, 0.05);
    
    // Update position
    this.x += this.vx;
    this.y += this.vy;
    
    // Fade out
    this.alpha -= 2;
    
    // Reset if off screen or dead
    if (this.y > height + 50 || this.alpha <= 0) {
      this.reset();
    }
  }
  
  display() {
    noStroke();
    fill(this.color, this.alpha);
    ellipse(this.x, this.y, this.size, this.size);
  }
  
  isDead() {
    return this.alpha <= 0;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
