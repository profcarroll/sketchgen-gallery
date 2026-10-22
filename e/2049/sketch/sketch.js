let mercury;
let kite;
let tether;

function setup() {
  createCanvas(windowWidth, windowHeight);
  mercury = new Mercury();
  kite = new Kite(width / 2, height / 2);
  tether = new Tether(kite);
}

function draw() {
  background(10, 15, 30);
  
  mercury.update();
  mercury.display();
  
  tether.update();
  tether.display();
  
  kite.update();
  kite.display();
}

function mousePressed() {
  kite.pressed = true;
  kite.reset();
}

function mouseReleased() {
  kite.pressed = false;
}

class Mercury {
  constructor() {
    this.particles = [];
    this.numParticles = 800;
    
    for (let i = 0; i < this.numParticles; i++) {
      this.particles.push({
        x: random(width),
        y: random(height),
        vx: random(-0.5, 0.5),
        vy: random(-0.5, 0.5),
        size: random(1, 3),
        alpha: random(80, 150)
      });
    }
  }
  
  update() {
    for (let p of this.particles) {
      // Slowly shift particles in a fluid motion
      p.vx += (noise(p.x * 0.01, p.y * 0.01, frameCount * 0.005) - 0.5) * 0.2;
      p.vy += (noise(p.x * 0.01, p.y * 0.01, frameCount * 0.005 + 1000) - 0.5) * 0.2;
      
      // Apply velocity
      p.x += p.vx;
      p.y += p.vy;
      
      // Damping
      p.vx *= 0.98;
      p.vy *= 0.98;
      
      // Wrap around edges
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;
    }
  }
  
  display() {
    noStroke();
    for (let p of this.particles) {
      fill(100, 150, 255, p.alpha);
      ellipse(p.x, p.y, p.size);
    }
  }
}

class Kite {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.angle = 0;
    this.angularVelocity = 0;
    this.size = 15;
    this.color = color(255, 200, 100);
    this.pressed = false;
  }

  update() {
    if (this.pressed) {
      let target = createVector(mouseX, mouseY);
      let desired = p5.Vector.sub(target, this.position);
      desired.normalize();
      desired.mult(0.3);
      this.acceleration.add(desired);
    }
    
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);

    // Add some rotation for fluttering effect
    this.angularVelocity += random(-0.02, 0.02);
    this.angle += this.angularVelocity;
    this.angularVelocity *= 0.9;

    // Boundary checks
    if (this.position.x < 0) this.position.x = width;
    if (this.position.x > width) this.position.x = 0;
    if (this.position.y < 0) this.position.y = height;
    if (this.position.y > height) this.position.y = 0;
  }

  display() {
    push();
    translate(this.position.x, this.position.y);
    rotate(this.angle);

    // Draw kite body
    fill(this.color);
    noStroke();
    beginShape();
    vertex(0, -this.size);
    vertex(-this.size/2, this.size/2);
    vertex(0, this.size/3);
    vertex(this.size/2, this.size/2);
    endShape(CLOSE);

    // Draw kite string
    stroke(255, 180);
    strokeWeight(1);
    line(0, 0, 0, -this.size * 1.5);

    pop();
  }

  reset() {
    this.velocity.mult(0);
    this.acceleration.mult(0);
    this.angularVelocity = 0;
  }
}

class Tether {
  constructor(kite) {
    this.kite = kite;
    this.points = [];
    this.maxPoints = 20;
  }
  
  update() {
    // Add current kite position to tether
    this.points.push({
      x: this.kite.position.x,
      y: this.kite.position.y,
      time: frameCount
    });
    
    // Keep only maxPoints
    if (this.points.length > this.maxPoints) {
      this.points.shift();
    }
  }
  
  display() {
    if (this.points.length < 2) return;
    
    noFill();
    stroke(255, 100);
    strokeWeight(1);
    beginShape();
    for (let i = 0; i < this.points.length; i++) {
      let p = this.points[i];
      vertex(p.x, p.y);
    }
    endShape();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
