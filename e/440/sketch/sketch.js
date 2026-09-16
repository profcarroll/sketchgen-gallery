let forms = [];
let tails = [];

class BiolumForm {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D().mult(random(0.5, 2));
    this.size = random(5, 20);
    this.hue = random(200, 280);
    this.sat = random(70, 100);
    this.bri = random(70, 100);
    this.pulse = 0;
    this.pulseDir = 1;
    this.tail = [];
    this.maxTailLength = 50;
  }

  update() {
    // Update position
    this.pos.add(this.vel);
    
    // Bounce off edges
    if (this.pos.x < 0 || this.pos.x > width) this.vel.x *= -1;
    if (this.pos.y < 0 || this.pos.y > height) this.vel.y *= -1;
    
    // Pulsing effect
    this.pulse += 0.05 * this.pulseDir;
    if (this.pulse > 1) {
      this.pulse = 1;
      this.pulseDir = -1;
    } else if (this.pulse < 0) {
      this.pulse = 0;
      this.pulseDir = 1;
    }
    
    // Add to tail
    this.tail.push(this.pos.copy());
    if (this.tail.length > this.maxTailLength) {
      this.tail.shift();
    }
  }

  display() {
    // Draw glow pulse
    noStroke();
    fill(this.hue, this.sat, this.bri, 50);
    for (let i = 0; i < 3; i++) {
      ellipse(this.pos.x, this.pos.y, 
              this.size * (1 + i * 0.5) * (1 + this.pulse), 
              this.size * (1 + i * 0.5) * (1 + this.pulse));
    }
    
    // Draw main form
    fill(this.hue, this.sat, this.bri, 200);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
    
    // Draw tail
    if (this.tail.length > 1) {
      strokeWeight(1);
      for (let i = 0; i < this.tail.length - 1; i++) {
        let alpha = map(i, 0, this.tail.length - 1, 0, 150);
        stroke(this.hue, this.sat, this.bri, alpha);
        line(this.tail[i].x, this.tail[i].y, 
             this.tail[i+1].x, this.tail[i+1].y);
      }
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create initial biolum forms
  for (let i = 0; i < 20; i++) {
    forms.push(new BiolumForm());
  }
}

function draw() {
  background(0, 0, 5); // Dark blue background
  
  // Update and display all forms
  for (let form of forms) {
    form.update();
    form.display();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
