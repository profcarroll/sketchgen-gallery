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
  }
  
  update() {
    this.radius += 1;
    this.alpha -= 3;
  }
  
  isFinished() {
    return this.alpha <= 0 || this.radius > this.maxRadius;
  }
  
  display() {
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.radius * 2);
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
  
  // Check for collisions between circles and stars
  for (let circle of circles) {
    for (let star of stars) {
      let d = dist(circle.x, circle.y, star.x, star.y);
      if (d < circle.size/2 + star.size/2) {
        flares.push(new Flare(star.x, star.y));
      }
    }
  }
  
  // Update and display flares
  for (let i = flares.length - 1; i >= 0; i--) {
    flares[i].update();
    flares[i].display();
    
    if (flares[i].isFinished()) {
      flares.splice(i, 1);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
