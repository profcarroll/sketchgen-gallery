let filaments = [];
let clusters = [];
let fluid;

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Create the viscous fluid background
  fluid = new Fluid();
  
  // Create filaments
  for (let i = 0; i < 500; i++) {
    filaments.push(new Filament());
  }
  
  // Create glowing clusters
  for (let i = 0; i < 15; i++) {
    clusters.push(new Cluster(random(width), random(height)));
  }
}

function draw() {
  background(240, 5, 10); // Deep cool mauve background
  
  // Update and display fluid
  fluid.update();
  fluid.display();
  
  // Update and display filaments
  for (let f of filaments) {
    f.update();
    f.display();
  }
  
  // Update and display clusters
  for (let c of clusters) {
    c.update();
    c.display();
  }
}

class Fluid {
  constructor() {
    this.particles = [];
    for (let i = 0; i < 2000; i++) {
      this.particles.push({
        x: random(width),
        y: random(height),
        vx: random(-0.5, 0.5),
        vy: random(-0.5, 0.5),
        size: random(1, 3),
        hue: random(200, 240) // Cool mauve to gray
      });
    }
  }
  
  update() {
    for (let p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      
      // Bounce off edges
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
      
      // Slowly drift
      p.vx += random(-0.01, 0.01);
      p.vy += random(-0.01, 0.01);
      
      // Clamp velocity
      p.vx = constrain(p.vx, -1, 1);
      p.vy = constrain(p.vy, -1, 1);
    }
  }
  
  display() {
    for (let p of this.particles) {
      fill(p.hue, 30, 70, 0.2);
      ellipse(p.x, p.y, p.size);
    }
  }
}

class Filament {
  constructor() {
    this.points = [];
    this.length = random(15, 40);
    this.x = random(width);
    this.y = random(height);
    this.hue = random(200, 240); // Cool mauve to gray
    this.saturation = random(20, 50);
    this.brightness = random(60, 80);
    this.speed = random(0.1, 0.3);
    
    for (let i = 0; i < this.length; i++) {
      this.points.push({
        x: this.x,
        y: this.y,
        age: i
      });
    }
  }
  
  update() {
    let head = this.points[0];
    head.x += random(-this.speed, this.speed);
    head.y += random(-this.speed, this.speed);
    
    // Add some noise to movement
    head.x += sin(frameCount * 0.01) * 0.2;
    head.y += cos(frameCount * 0.01) * 0.2;
    
    // Bounce off edges
    if (head.x < 0 || head.x > width || head.y < 0 || head.y > height) {
      head.x = constrain(head.x, 0, width);
      head.y = constrain(head.y, 0, height);
    }
    
    // Shift all points down the chain
    for (let i = this.points.length - 1; i > 0; i--) {
      this.points[i].x = this.points[i-1].x;
      this.points[i].y = this.points[i-1].y;
    }
    
    // Age each point
    for (let p of this.points) {
      p.age++;
    }
    
    // Remove old points and add new ones occasionally
    if (frameCount % 30 === 0 && this.points.length < 60) {
      this.points.push({
        x: head.x,
        y: head.y,
        age: 0
      });
    } else if (this.points.length > 40 && random() < 0.1) {
      this.points.shift();
    }
  }
  
  display() {
    beginShape();
    for (let p of this.points) {
      let alpha = map(p.age, 0, 20, 0, 0.5);
      fill(this.hue, this.saturation, this.brightness, alpha);
      vertex(p.x, p.y);
    }
    endShape();
    
    // Draw glow effect
    noFill();
    stroke(this.hue, this.saturation, this.brightness, 0.1);
    strokeWeight(2);
    beginShape();
    for (let p of this.points) {
      vertex(p.x, p.y);
    }
    endShape();
  }
}

class Cluster {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.hue = random(180, 220); // Iridescent silver
    this.size = random(20, 50);
    this.pulseSpeed = random(0.02, 0.05);
    this.pulseOffset = random(TWO_PI);
    this.driftX = random(-0.1, 0.1);
    this.driftY = random(-0.1, 0.1);
    this.ripples = [];
  }
  
  update() {
    // Pulsing
    this.size += sin(frameCount * this.pulseSpeed + this.pulseOffset) * 0.5;
    this.size = constrain(this.size, 20, 60);
    
    // Drifting
    this.x += this.driftX;
    this.y += this.driftY;
    
    if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
      this.x = constrain(this.x, 0, width);
      this.y = constrain(this.y, 0, height);
      this.driftX *= -1;
      this.driftY *= -1;
    }
    
    // React to mouse
    let d = dist(mouseX, mouseY, this.x, this.y);
    if (d < 150) {
      let force = map(d, 0, 150, 2, 0);
      this.pulseSpeed += force * 0.01;
      this.pulseSpeed = constrain(this.pulseSpeed, 0.01, 0.1);
      
      // Create ripple
      if (frameCount % 5 === 0) {
        this.ripples.push({
          x: this.x,
          y: this.y,
          size: 0,
          alpha: 0.8
        });
      }
    } else {
      this.pulseSpeed = constrain(this.pulseSpeed, 0.02, 0.05);
    }
    
    // Update ripples
    for (let i = this.ripples.length - 1; i >= 0; i--) {
      let r = this.ripples[i];
      r.size += 2;
      r.alpha -= 0.02;
      if (r.alpha <= 0) {
        this.ripples.splice(i, 1);
      }
    }
  }
  
  display() {
    // Draw ripples
    for (let r of this.ripples) {
      noFill();
      stroke(this.hue, 50, 90, r.alpha);
      strokeWeight(2);
      ellipse(r.x, r.y, r.size);
    }
    
    // Draw cluster glow
    fill(this.hue, 50, 90, 0.7);
    noStroke();
    ellipse(this.x, this.y, this.size * 1.5);
    
    // Draw core
    fill(this.hue, 80, 95, 1);
    ellipse(this.x, this.y, this.size);
    
    // Draw inner glow
    fill(this.hue, 40, 70, 0.3);
    ellipse(this.x, this.y, this.size * 0.7);
  }
}
