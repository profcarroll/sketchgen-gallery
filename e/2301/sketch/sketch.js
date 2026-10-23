let particles;
let kite;
let tether;
let faultLines;

function setup() {
  createCanvas(windowWidth, windowHeight);
  particles = [];
  faultLines = [];
  
  // Create particles for the aquatic environment
  for (let i = 0; i < 1200; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: random(-0.3, 0.3),
      vy: random(-0.3, 0.3),
      size: random(0.5, 2),
      alpha: random(30, 100),
      color: color(random(50, 150), random(100, 200), random(200, 255), random(50, 150))
    });
  }
  
  // Create fault lines
  for (let i = 0; i < 8; i++) {
    faultLines.push({
      x: random(width),
      y: random(height),
      angle: random(TWO_PI),
      length: random(200, 600),
      width: random(1, 3)
    });
  }
  
  kite = new Kite(width / 2, height / 2);
  tether = new Tether(kite);
}

function draw() {
  background(5, 10, 25);
  
  // Update and display fault lines
  for (let line of faultLines) {
    line.angle += 0.002;
    stroke(100, 180, 255, 80);
    strokeWeight(line.width);
    noFill();
    beginShape();
    let endX = line.x + cos(line.angle) * line.length;
    let endY = line.y + sin(line.angle) * line.length;
    vertex(line.x, line.y);
    vertex(endX, endY);
    endShape();
  }
  
  // Update and display particles
  for (let p of particles) {
    // Fluid motion using noise
    p.vx += (noise(p.x * 0.01, p.y * 0.01, frameCount * 0.003) - 0.5) * 0.1;
    p.vy += (noise(p.x * 0.01, p.y * 0.01, frameCount * 0.003 + 1000) - 0.5) * 0.1;
    
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
    
    // Display particle
    noStroke();
    fill(p.color);
    ellipse(p.x, p.y, p.size);
  }
  
  // Update and display tether
  tether.update();
  tether.display();
  
  // Update and display kite
  kite.update();
  kite.display();
}

function mousePressed() {
  kite.pressed = true;
  kite.reset();
  kite.position.set(mouseX, mouseY);
}

function mouseReleased() {
  kite.pressed = false;
}

class Kite {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.angle = 0;
    this.angularVelocity = 0;
    this.size = 12;
    this.color = color(200, 255, 255, 200);
    this.pressed = false;
    this.tension = 0;
  }

  update() {
    if (this.pressed) {
      let target = createVector(mouseX, mouseY);
      let desired = p5.Vector.sub(target, this.position);
      let distance = desired.mag();
      
      // Calculate tension based on distance
      this.tension = map(distance, 0, 300, 1, 0.2);
      
      desired.normalize();
      desired.mult(0.4 * this.tension);
      this.acceleration.add(desired);
    }
    
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);

    // Add some rotation for fluttering effect
    this.angularVelocity += random(-0.02, 0.02) * (1 - this.tension);
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

    // Draw kite body with glowing effect
    fill(this.color);
    noStroke();
    beginShape();
    vertex(0, -this.size);
    vertex(-this.size/2, this.size/2);
    vertex(0, this.size/3);
    vertex(this.size/2, this.size/2);
    endShape(CLOSE);

    // Draw kite string with glow
    stroke(180, 255, 255, 150);
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
    this.maxPoints = 30;
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
    
    // Draw tether with glow effect
    noFill();
    stroke(200, 255, 255, 100);
    strokeWeight(1.5);
    beginShape();
    for (let i = 0; i < this.points.length; i++) {
      let p = this.points[i];
      vertex(p.x, p.y);
    }
    endShape();
    
    // Draw leading point with brighter glow
    if (this.points.length > 0) {
      let lastPoint = this.points[this.points.length - 1];
      noStroke();
      fill(255, 255, 255, 180);
      ellipse(lastPoint.x, lastPoint.y, 4);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
