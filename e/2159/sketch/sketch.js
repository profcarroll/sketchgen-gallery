let particles = [];
let streams = [];
let mouseInteraction = { x: 0, y: 0, radius: 0 };
let isMousePressed = false;
let backgroundGlow;

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(2, 6);
    this.speedX = random(-0.5, 0.5);
    this.speedY = random(0.5, 1.5);
    this.hue = random(80, 120); // emerald to cyan
    this.saturation = 100;
    this.brightness = random(70, 100);
    this.alpha = random(0.3, 0.7);
    this.pulse = random(TWO_PI);
    this.pulseSpeed = random(0.02, 0.05);
    this.life = 1;
    this.decay = random(0.001, 0.003);
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    
    // Apply gravity
    this.speedY += 0.02;
    
    // Add some noise for organic movement
    this.x += sin(frameCount * 0.01 + this.pulse) * 0.1;
    
    // Pulsing effect
    this.pulse += this.pulseSpeed;
    
    // Decay life
    this.life -= this.decay;
    
    // Reset if off screen or dead
    if (this.y > height + 50 || this.life <= 0) {
      this.reset();
    }
  }

  reset() {
    this.x = random(width);
    this.y = -20;
    this.size = random(2, 6);
    this.speedX = random(-0.5, 0.5);
    this.speedY = random(0.5, 1.5);
    this.pulse = random(TWO_PI);
    this.life = 1;
  }

  display() {
    let pulseSize = sin(this.pulse) * 0.5 + 1;
    let size = this.size * pulseSize;
    
    noStroke();
    fill(this.hue, this.saturation, this.brightness, this.alpha * this.life);
    ellipse(this.x, this.y, size, size);
    
    // Add glow effect
    fill(this.hue, this.saturation, 100, this.alpha * 0.3 * this.life);
    ellipse(this.x, this.y, size * 2, size * 2);
  }
}

class Stream {
  constructor() {
    this.points = [];
    this.length = int(random(50, 100));
    this.x = random(width);
    this.y = random(-50, -10);
    this.hue = random(80, 120); // emerald to cyan
    this.alpha = random(0.3, 0.7);
    this.speed = random(0.5, 1.5);
    this.pulse = 0;
    
    for (let i = 0; i < this.length; i++) {
      this.points.push({x: this.x, y: this.y});
    }
  }

  update() {
    this.pulse += 0.05;
    
    // Move stream
    this.x += cos(frameCount * 0.01) * this.speed * 0.2;
    this.y += this.speed;
    
    // Update points
    for (let i = this.points.length - 1; i > 0; i--) {
      this.points[i].x = this.points[i-1].x;
      this.points[i].y = this.points[i-1].y;
    }
    
    this.points[0].x = this.x;
    this.points[0].y = this.y;
    
    // Reset if off screen or expired
    if (this.y > height + 50) {
      this.reset();
    }
  }

  reset() {
    this.points = [];
    this.length = int(random(50, 100));
    this.x = random(width);
    this.y = random(-50, -10);
    this.pulse = 0;
    
    for (let i = 0; i < this.length; i++) {
      this.points.push({x: this.x, y: this.y});
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
  
  // Create particles
  for (let i = 0; i < 200; i++) {
    particles.push(new Particle(random(width), random(height)));
  }
  
  // Create data streams
  for (let i = 0; i < 10; i++) {
    streams.push(new Stream());
  }
}

function draw() {
  background(0, 0, 5);
  
  // Draw streams
  for (let stream of streams) {
    stream.update();
    stream.display();
  }
  
  // Draw particles
  for (let p of particles) {
    p.update();
    p.display();
  }
  
  // Add subtle pulsing effect to background
  let pulse = sin(frameCount * 0.02) * 0.1 + 0.9;
  fill(0, 0, 10, pulse * 0.05);
  noStroke();
  rect(0, 0, width, height);
  
  // Handle mouse interaction
  if (isMousePressed && mouseInteraction.radius < 100) {
    mouseInteraction.radius += 2;
  } else if (!isMousePressed && mouseInteraction.radius > 0) {
    mouseInteraction.radius -= 2;
  }
  
  // Apply interaction to nearby particles
  for (let p of particles) {
    let d = dist(p.x, p.y, mouseInteraction.x, mouseInteraction.y);
    if (d < mouseInteraction.radius) {
      let force = map(d, 0, mouseInteraction.radius, 2, 0);
      p.x += (p.x - mouseInteraction.x) * 0.01 * force;
      p.y += (p.y - mouseInteraction.y) * 0.01 * force;
    }
  }
}

function mousePressed() {
  isMousePressed = true;
  mouseInteraction.x = mouseX;
  mouseInteraction.y = mouseY;
  mouseInteraction.radius = 0;
}

function mouseReleased() {
  isMousePressed = false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
