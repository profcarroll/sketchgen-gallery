let particles1 = [];
let particles2 = [];
let particleCount = 150;
let streamWidth = 80;
let interactionRadius = 60;

class Particle {
  constructor(x, y, color) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(0.5, 2));
    this.color = color;
    this.originalColor = color;
    this.size = random(4, 8);
  }

  update() {
    this.pos.add(this.vel);
    
    // Bounce off edges
    if (this.pos.x < 0 || this.pos.x > width) this.vel.x *= -1;
    if (this.pos.y < 0 || this.pos.y > height) this.vel.y *= -1;
    
    // Keep within canvas
    this.pos.x = constrain(this.pos.x, 0, width);
    this.pos.y = constrain(this.pos.y, 0, height);
  }

  display() {
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.size);
  }

  checkInteraction(otherParticles) {
    for (let other of otherParticles) {
      let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
      if (d < interactionRadius) {
        // Swap colors temporarily
        this.color = other.originalColor;
        other.color = this.originalColor;
        return true;
      }
    }
    // Return to original color after interaction
    this.color = this.originalColor;
    return false;
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create two streams of particles
  for (let i = 0; i < particleCount; i++) {
    let x = random(width/4, width/2 - streamWidth/2);
    let y = random(height);
    particles1.push(new Particle(x, y, color(random(30, 60), 100, 100))); // Blue stream
  }

  for (let i = 0; i < particleCount; i++) {
    let x = random(width/2 + streamWidth/2, 3*width/4);
    let y = random(height);
    particles2.push(new Particle(x, y, color(random(180, 210), 100, 100))); // Green stream
  }
}

function draw() {
  background(0, 0, 10); // Dark background

  // Update and display particles
  for (let p of particles1) {
    p.update();
    p.checkInteraction(particles2);
    p.display();
  }

  for (let p of particles2) {
    p.update();
    p.checkInteraction(particles1);
    p.display();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
