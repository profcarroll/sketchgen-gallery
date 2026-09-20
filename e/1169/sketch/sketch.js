let flowField;
let tensionPoints = [];
let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize flow field
  flowField = new FlowField(20);
  
  // Create initial tension points
  for (let i = 0; i < 15; i++) {
    tensionPoints.push({
      x: random(width),
      y: random(height),
      size: random(20, 60),
      growth: random(0.1, 0.5),
      hue: random(360)
    });
  }
  
  // Create particles
  for (let i = 0; i < 500; i++) {
    particles.push(new Particle(random(width), random(height)));
  }
}

function draw() {
  background(0, 0, 10);
  
  // Update and display tension points
  for (let point of tensionPoints) {
    point.size += point.growth;
    point.hue = (point.hue + 0.5) % 360;
    
    // Draw pulsing force field
    noFill();
    stroke(point.hue, 80, 100, 0.3);
    strokeWeight(2);
    ellipse(point.x, point.y, point.size * 2);
    
    // Draw tension lines to nearby particles
    for (let p of particles) {
      let d = dist(point.x, point.y, p.x, p.y);
      if (d < point.size && d > 0) {
        stroke(point.hue, 100, 80, map(d, 0, point.size, 0.8, 0));
        line(point.x, point.y, p.x, p.y);
      }
    }
    
    // Occasionally add new tension point
    if (random() < 0.001) {
      tensionPoints.push({
        x: random(width),
        y: random(height),
        size: random(20, 60),
        growth: random(0.1, 0.5),
        hue: random(360)
      });
    }
    
    // Remove old points
    if (point.size > 200) {
      tensionPoints.splice(tensionPoints.indexOf(point), 1);
    }
  }
  
  // Update and display particles
  for (let p of particles) {
    p.update();
    p.display();
  }
  
  // Update flow field
  flowField.update();
}

class FlowField {
  constructor(resolution) {
    this.resolution = resolution;
    this.cols = width / resolution;
    this.rows = height / resolution;
    this.field = [];
    
    for (let y = 0; y < this.rows; y++) {
      this.field[y] = [];
      for (let x = 0; x < this.cols; x++) {
        this.field[y][x] = createVector(0, 0);
      }
    }
  }
  
  update() {
    let time = millis() * 0.001;
    
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        let angle = noise(x * 0.02, y * 0.02, time) * TWO_PI * 4;
        let v = p5.Vector.fromAngle(angle);
        v.mult(0.5);
        this.field[y][x] = v;
      }
    }
  }
  
  lookup(lookup) {
    let x = floor(lookup.x / this.resolution);
    let y = floor(lookup.y / this.resolution);
    
    x = constrain(x, 0, this.cols - 1);
    y = constrain(y, 0, this.rows - 1);
    
    return this.field[y][x];
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(1, 3);
    this.hue = random(360);
    this.history = [];
    this.maxHistory = 20;
  }
  
  update() {
    let force = flowField.lookup(createVector(this.x, this.y));
    
    // Add tension forces
    for (let point of tensionPoints) {
      let d = dist(this.x, this.y, point.x, point.y);
      if (d < point.size * 2) {
        let angle = atan2(this.y - point.y, this.x - point.x);
        let strength = map(d, 0, point.size * 2, 1, 0);
        force.add(createVector(cos(angle) * strength * 0.3, sin(angle) * strength * 0.3));
      }
    }
    
    // Apply force
    this.vx += force.x;
    this.vy += force.y;
    
    // Limit velocity
    let speed = sqrt(this.vx * this.vx + this.vy * this.vy);
    if (speed > 3) {
      this.vx = (this.vx / speed) * 3;
      this.vy = (this.vy / speed) * 3;
    }
    
    // Update position
    this.x += this.vx;
    this.y += this.vy;
    
    // Wrap around edges
    if (this.x > width) this.x = 0;
    if (this.x < 0) this.x = width;
    if (this.y > height) this.y = 0;
    if (this.y < 0) this.y = height;
    
    // Add to history
    this.history.push(createVector(this.x, this.y));
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
  }
  
  display() {
    noFill();
    stroke(this.hue, 100, 100, 0.7);
    strokeWeight(this.size);
    
    beginShape();
    for (let v of this.history) {
      vertex(v.x, v.y);
    }
    endShape();
  }
}
