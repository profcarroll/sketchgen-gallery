let circles = [];
let stars = [];
let flares = [];

class Circle {
  constructor() {
    this.reset();
  }
  
  reset() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(50, 200);
    this.speedX = random(-0.1, 0.1);
    this.speedY = random(-0.1, 0.1);
    this.alpha = random(30, 80);
    this.color = color(255, 255, 255, this.alpha);
    this.hueShift = random(-10, 10); // For subtle color shifts
  }
  
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    
    if (this.x > width + this.size) this.x = -this.size;
    if (this.x < -this.size) this.x = width + this.size;
    if (this.y > height + this.size) this.y = -this.size;
    if (this.y < -this.size) this.y = height + this.size;
  }
  
  display() {
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.size);
  }
}

class Star {
  constructor() {
    this.reset();
  }
  
  reset() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(1, 3);
    this.speedX = random(-0.5, 0.5);
    this.speedY = random(-0.5, 0.5);
    this.alpha = random(150, 255);
    this.color = color(255, 255, 255, this.alpha);
  }
  
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    
    if (this.x > width + this.size) this.x = -this.size;
    if (this.x < -this.size) this.x = width + this.size;
    if (this.y > height + this.size) this.y = -this.size;
    if (this.y < -this.size) this.y = height + this.size;
  }
  
  display() {
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.size);
  }
}

class Flare {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 0;
    this.maxRadius = random(20, 40);
    this.alpha = 255;
    this.color = color(255, 255, 200, this.alpha);
    this.glowAlpha = 100;
    this.decayRate = random(0.5, 1.0);
    this.hueShift = random(-20, 20); // Shift hue of nearby circles
  }
  
  update() {
    this.radius += 1;
    this.alpha -= 3 * this.decayRate;
    this.glowAlpha -= 0.5 * this.decayRate;
  }
  
  isFinished() {
    return this.alpha <= 0 || this.radius > this.maxRadius;
  }
  
  display() {
    noStroke();
    
    // Draw the main flare
    fill(this.color);
    ellipse(this.x, this.y, this.radius * 2);
    
    // Draw a glowing afterglow
    fill(255, 255, 200, this.glowAlpha);
    ellipse(this.x, this.y, this.radius * 4);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);
  
  // Create circles
  for (let i = 0; i < 15; i++) {
    circles.push(new Circle());
  }
  
  // Create stars
  for (let i = 0; i < 200; i++) {
    stars.push(new Star());
  }
}

function draw() {
  background(10, 10, 30);
  
  // Update and display circles
  for (let circle of circles) {
    circle.update();
    circle.display();
  }
  
  // Update and display stars
  for (let star of stars) {
    star.update();
    star.display();
  }
  
  // Occasionally create a flare
  if (frameCount % 100 === 0) {
    let x = random(width);
    let y = random(height);
    flares.push(new Flare(x, y));
  }
  
  // Update and display flares
  for (let i = flares.length - 1; i >= 0; i--) {
    flares[i].update();
    flares[i].display();
    
    if (flares[i].isFinished()) {
      flares.splice(i, 1);
    }
  }
  
  // Apply color shifts to nearby circles
  for (let flare of flares) {
    if (!flare.isFinished()) {
      for (let circle of circles) {
        let d = dist(flare.x, flare.y, circle.x, circle.y);
        if (d < circle.size + flare.radius * 2) {
          // Shift the hue of nearby circles
          let hueDiff = map(d, 0, circle.size + flare.radius * 2, 10, 0);
          let newHue = (hue(circle.color) + flare.hueShift * (1 - hueDiff / 10)) % 360;
          circle.color = color(newHue, saturation(circle.color), brightness(circle.color), alpha(circle.color));
        }
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
