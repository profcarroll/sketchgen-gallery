let circles = [];
let stars = [];
let ripples = [];
let webs = [];

class Circle {
  constructor() {
    this.reset();
  }
  
  reset() {
    this.x = random(width);
    this.y = height + random(height/2);
    this.r = random(50, 200);
    this.speed = random(0.2, 0.8);
    this.alpha = random(30, 80);
    this.color = color(random(100, 255), random(100, 255), random(200, 255), this.alpha);
  }
  
  update() {
    this.y -= this.speed;
    if (this.y < -this.r) this.reset();
  }
  
  display() {
    noFill();
    stroke(this.color);
    strokeWeight(1);
    ellipse(this.x, this.y, this.r * 2);
  }
}

class Star {
  constructor() {
    this.reset();
  }
  
  reset() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(0.5, 3);
    this.speed = random(0.1, 0.5);
    this.alpha = random(100, 255);
    this.color = color(255, 255, 255, this.alpha);
    this.trail = [];
    this.maxTrailLength = 10;
  }
  
  update() {
    this.y += this.speed;
    this.x += sin(this.y * 0.01) * 0.2;
    
    // Add to trail
    this.trail.push({x: this.x, y: this.y});
    if (this.trail.length > this.maxTrailLength) {
      this.trail.shift();
    }
    
    if (this.y > height + 50) this.reset();
  }
  
  display() {
    // Draw trail
    noFill();
    stroke(this.color);
    strokeWeight(1);
    beginShape();
    for (let i = 0; i < this.trail.length; i++) {
      let point = this.trail[i];
      vertex(point.x, point.y);
    }
    endShape();
    
    // Draw star
    fill(this.color);
    noStroke();
    ellipse(this.x, this.y, this.size);
  }
}

class Ripple {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 0;
    this.maxR = random(30, 80);
    this.alpha = 255;
    this.color = color(255, 255, 255, this.alpha);
  }
  
  update() {
    this.r += 1;
    this.alpha -= 2;
    return this.alpha > 0;
  }
  
  display() {
    noFill();
    stroke(this.color);
    strokeWeight(1);
    ellipse(this.x, this.y, this.r * 2);
  }
}

class Web {
  constructor() {
    this.segments = [];
    this.reset();
  }
  
  reset() {
    this.segments = [];
    for (let i = 0; i < 50; i++) {
      this.segments.push({
        x: random(width),
        y: random(height),
        size: random(2, 8)
      });
    }
  }
  
  update() {
    // Slight movement to create dynamic web
    for (let seg of this.segments) {
      seg.x += sin(frameCount * 0.01 + seg.y * 0.01) * 0.1;
      seg.y += cos(frameCount * 0.01 + seg.x * 0.01) * 0.1;
    }
  }
  
  display() {
    noFill();
    stroke(255, 30);
    strokeWeight(0.5);
    beginShape();
    for (let i = 0; i < this.segments.length; i++) {
      let seg = this.segments[i];
      vertex(seg.x, seg.y);
    }
    endShape();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize elements
  for (let i = 0; i < 20; i++) {
    circles.push(new Circle());
  }
  
  for (let i = 0; i < 100; i++) {
    stars.push(new Star());
  }
  
  for (let i = 0; i < 5; i++) {
    webs.push(new Web());
  }
}

function draw() {
  background(0, 0, 0);
  
  // Draw webs
  for (let web of webs) {
    web.update();
    web.display();
  }
  
  // Draw circles and handle interactions
  for (let circle of circles) {
    circle.update();
    circle.display();
    
    // Check for star interaction
    for (let star of stars) {
      let d = dist(circle.x, circle.y, star.x, star.y);
      if (d < circle.r) {
        // Create ripple where circle and star meet
        ripples.push(new Ripple(star.x, star.y));
        
        // Make circle flare
        circle.alpha = min(255, circle.alpha + 10);
        circle.color = color(hue(circle.color), saturation(circle.color), 100, circle.alpha/255);
      }
    }
    
    // Reset circle color if not interacting
    if (circle.alpha > 80) {
      circle.alpha -= 0.5;
      circle.color = color(hue(circle.color), saturation(circle.color), brightness(circle.color), circle.alpha/255);
    }
  }
  
  // Draw stars and their trails
  for (let star of stars) {
    star.update();
    star.display();
  }
  
  // Update and draw ripples
  for (let i = ripples.length - 1; i >= 0; i--) {
    let ripple = ripples[i];
    if (!ripple.update()) {
      ripples.splice(i, 1);
    } else {
      ripple.display();
    }
  }
  
  // Occasionally create new web
  if (frameCount % 300 === 0) {
    webs.push(new Web());
    if (webs.length > 10) {
      webs.shift();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
