let dustDevils = [];
let cracks = [];
let groundTexture;

function setup() {
  createCanvas(windowWidth, windowHeight);
  groundTexture = createGraphics(width, height);
  generateCracks();
  generateDustDevils();
}

function draw() {
  // Draw sky
  background(240, 230, 220); // Beige sky
  
  // Draw textured ground with cracks
  image(groundTexture, 0, 0);
  
  // Update and draw dust devils
  for (let i = 0; i < dustDevils.length; i++) {
    dustDevils[i].update();
    dustDevils[i].display();
  }
}

function generateCracks() {
  // Create a textured ground with terracotta tones and cracks
  groundTexture.noStroke();
  groundTexture.fill(139, 69, 19); // Terracotta base
  groundTexture.rect(0, 0, width, height);
  
  // Add cracks
  for (let i = 0; i < 50; i++) {
    let x = random(width);
    let y = random(height);
    let w = random(10, 50);
    let h = random(200, 400);
    groundTexture.fill(101, 67, 33); // Darker terracotta for cracks
    groundTexture.rect(x, y, w, h);
  }
  
  // Add sediment patches in cracks
  groundTexture.fill(200, 180, 160); // Light beige sediment
  for (let i = 0; i < 30; i++) {
    let x = random(width);
    let y = random(height);
    let w = random(5, 20);
    let h = random(5, 20);
    groundTexture.rect(x, y, w, h);
  }
}

function generateDustDevils() {
  for (let i = 0; i < 8; i++) {
    dustDevils.push(new Dustdevil(random(width), random(height)));
  }
}

class Dustdevil {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(10, 30);
    this.speed = random(0.5, 2);
    this.angle = random(TWO_PI);
    this.trail = [];
    this.maxTrailLength = 20;
  }
  
  update() {
    // Move dust devil
    this.x += cos(this.angle) * this.speed;
    this.y += sin(this.angle) * this.speed;
    
    // Add to trail
    this.trail.push({x: this.x, y: this.y});
    if (this.trail.length > this.maxTrailLength) {
      this.trail.shift();
    }
    
    // Change direction occasionally
    if (random() < 0.02) {
      this.angle += random(-0.5, 0.5);
    }
    
    // Wrap around edges
    if (this.x < -this.size) this.x = width + this.size;
    if (this.x > width + this.size) this.x = -this.size;
    if (this.y < -this.size) this.y = height + this.size;
    if (this.y > height + this.size) this.y = -this.size;
  }
  
  display() {
    // Draw trail
    noFill();
    stroke(200, 180, 160);
    strokeWeight(2);
    beginShape();
    for (let i = 0; i < this.trail.length; i++) {
      let alpha = map(i, 0, this.trail.length, 0, 255);
      stroke(200, 180, 160, alpha);
      vertex(this.trail[i].x, this.trail[i].y);
    }
    endShape();
    
    // Draw dust devil
    noStroke();
    fill(200, 180, 160);
    ellipse(this.x, this.y, this.size, this.size);
    fill(150, 130, 110);
    ellipse(this.x, this.y, this.size * 0.7, this.size * 0.7);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  groundTexture = createGraphics(width, height);
  generateCracks();
}
