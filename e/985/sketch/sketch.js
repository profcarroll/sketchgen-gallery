let bubbles = [];
let vortices = [];
let liquidLevel = 0;
let streamHeight = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  liquidLevel = height * 0.7;
  streamHeight = height * 0.2;
}

function draw() {
  background(220, 10, 95, 0.95);
  
  // Draw container
  fill(220, 10, 80, 0.3);
  rect(0, liquidLevel, width, height - liquidLevel);
  
  // Update and draw bubbles
  for (let i = bubbles.length - 1; i >= 0; i--) {
    let b = bubbles[i];
    b.update();
    b.display();
    
    if (b.isDead()) {
      bubbles.splice(i, 1);
    }
  }
  
  // Update and draw vortices
  for (let i = vortices.length - 1; i >= 0; i--) {
    let v = vortices[i];
    v.update();
    v.display();
    
    if (v.isDead()) {
      vortices.splice(i, 1);
    }
  }
  
  // Create new bubbles and vortices from stream
  if (random() < 0.3) {
    let x = width / 2 + random(-20, 20);
    let y = liquidLevel - streamHeight;
    bubbles.push(new Bubble(x, y));
    
    // Create vortex at impact point
    vortices.push(new Vortex(x, liquidLevel));
  }
  
  // Add some random bubbles occasionally
  if (random() < 0.1) {
    let x = width / 2 + random(-30, 30);
    let y = liquidLevel - random(5, 20);
    bubbles.push(new Bubble(x, y));
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  liquidLevel = height * 0.7;
  streamHeight = height * 0.2;
}

class Bubble {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-1, 1), random(-2, -0.5));
    this.size = random(2, 6);
    this.hue = random(20, 40); // Yellow to orange
    this.alpha = random(0.7, 1);
    this.life = 255;
  }
  
  update() {
    this.vel.y *= 0.98; // Gravity
    this.vel.x *= 0.99; // Air resistance
    
    this.pos.add(this.vel);
    this.life -= 2;
  }
  
  display() {
    fill(this.hue, 100, 100, this.alpha * (this.life / 255));
    ellipse(this.pos.x, this.pos.y, this.size);
    
    // Add a highlight
    fill(255, 80, 100, 0.5 * (this.life / 255));
    ellipse(this.pos.x - this.size/4, this.pos.y - this.size/4, this.size/2);
  }
  
  isDead() {
    return this.life <= 0 || this.pos.y > height;
  }
}

class Vortex {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.radius = 0;
    this.maxRadius = random(30, 60);
    this.speed = random(0.5, 1.5);
    this.angle = random(TWO_PI);
    this.life = 255;
    this.hue = random(180, 240); // Blue to purple
  }
  
  update() {
    this.radius += this.speed;
    this.angle += 0.1;
    this.life -= 3;
  }
  
  display() {
    push();
    translate(this.pos.x, this.pos.y);
    
    // Draw vortex effect
    noFill();
    stroke(this.hue, 100, 100, this.life / 255 * 0.7);
    strokeWeight(1);
    
    for (let r = 0; r < this.radius; r += 3) {
      let angle = this.angle + r * 0.2;
      let x = cos(angle) * r;
      let y = sin(angle) * r;
      
      ellipse(x, y, 2);
    }
    
    pop();
  }
  
  isDead() {
    return this.life <= 0 || this.radius > this.maxRadius;
  }
}
