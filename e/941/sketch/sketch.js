let particles = [];
let vortexes = [];
let glass;
let stream;

function setup() {
  createCanvas(windowWidth, windowHeight);
  glass = new Glass();
  stream = new Stream();
  colorMode(HSB, 360, 100, 100, 1);
}

function draw() {
  background(0, 0, 10);
  glass.display();
  stream.update();
  stream.display();
  
  // Update and display vortexes
  for (let i = vortexes.length - 1; i >= 0; i--) {
    vortexes[i].update();
    vortexes[i].display();
    if (vortexes[i].isFinished()) {
      vortexes.splice(i, 1);
    }
  }
  
  // Update and display particles
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    if (particles[i].isFinished()) {
      particles.splice(i, 1);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Stream {
  constructor() {
    this.reset();
  }
  
  reset() {
    this.position = createVector(width/2, 0);
    this.velocity = createVector(0, random(2, 4));
    this.size = random(2, 6);
    this.color = color(random(180, 240), 90, 90, 0.8);
  }
  
  update() {
    // Add some randomness to the stream
    this.velocity.x += random(-0.5, 0.5);
    this.velocity.y += random(-0.2, 0.2);
    
    // Apply gravity
    this.velocity.y += 0.1;
    
    // Update position
    this.position.add(this.velocity);
    
    // Create new particles
    if (frameCount % 3 === 0) {
      let p = new Particle(this.position.x, this.position.y, this.color);
      particles.push(p);
    }
    
    // Check if stream hit the glass surface
    if (this.position.y > height * 0.75) {
      // Create vortex at impact point
      vortexes.push(new Vortex(this.position.x, this.position.y));
      this.reset();
    }
  }
  
  display() {
    noStroke();
    fill(this.color);
    ellipse(this.position.x, this.position.y, this.size);
  }
}

class Particle {
  constructor(x, y, c) {
    this.position = createVector(x, y);
    this.velocity = p5.Vector.random2D().mult(random(0.5, 2));
    this.velocity.y += random(-1, 1);
    this.color = c;
    this.lifespan = 255;
    this.size = random(1, 3);
  }
  
  update() {
    // Apply gravity
    this.velocity.y += 0.1;
    
    // Apply some drag
    this.velocity.mult(0.98);
    
    // Update position
    this.position.add(this.velocity);
    
    // Reduce lifespan
    this.lifespan -= 2;
  }
  
  display() {
    noStroke();
    fill(red(this.color), green(this.color), blue(this.color), this.lifespan/255);
    ellipse(this.position.x, this.position.y, this.size);
  }
  
  isFinished() {
    return this.lifespan < 0;
  }
}

class Vortex {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.radius = 0;
    this.maxRadius = random(30, 60);
    this.speed = random(0.5, 1.5);
    this.angle = random(TWO_PI);
    this.rotationSpeed = random(-0.05, 0.05);
    this.lifespan = 255;
    this.color = color(random(300, 360), 90, 90, 0.7);
  }
  
  update() {
    this.radius += this.speed;
    this.angle += this.rotationSpeed;
    this.lifespan -= 2;
  }
  
  display() {
    noFill();
    stroke(this.color);
    strokeWeight(1);
    
    // Draw spiral
    beginShape();
    for (let a = 0; a < TWO_PI * 4; a += 0.1) {
      let r = this.radius * (a / (TWO_PI * 4));
      let x = this.position.x + cos(a + this.angle) * r;
      let y = this.position.y + sin(a + this.angle) * r;
      vertex(x, y);
    }
    endShape();
    
    // Draw expanding circle
    noFill();
    stroke(this.color);
    strokeWeight(1);
    ellipse(this.position.x, this.position.y, this.radius * 2);
  }
  
  isFinished() {
    return this.lifespan < 0 || this.radius > this.maxRadius;
  }
}

class Glass {
  constructor() {
    // Draw a transparent glass with some reflection effect
  }
  
  display() {
    // Draw glass outline
    noFill();
    stroke(200, 30, 90, 0.3);
    strokeWeight(3);
    rect(100, 100, width - 200, height - 200, 10);
    
    // Draw some reflections
    stroke(255, 30, 90, 0.1);
    strokeWeight(1);
    for (let i = 0; i < 5; i++) {
      let y = height * 0.7 + i * 20;
      line(100, y, width - 100, y);
    }
    
    // Draw the liquid surface
    noStroke();
    fill(180, 30, 50, 0.1);
    rect(100, height * 0.75, width - 200, height * 0.25);
  }
}
