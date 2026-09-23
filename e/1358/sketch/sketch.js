let bubbles = [];
let steam = [];
let waterLevel;
let heat = 0;
let rippleOffset = 0;

function setup() {
  createCanvas(400, 400, WEBGL);
  waterLevel = height * 0.7;
  noStroke();
}

function draw() {
  background(10, 15, 60);
  
  // Draw container
  push();
  translate(0, 0, -100);
  fill(30, 40, 100, 80);
  box(width * 0.9, height * 0.9, 200);
  pop();
  
  // Draw water surface
  push();
  translate(0, waterLevel - height/2, 0);
  rotateX(PI);
  fill(20, 30, 90, 180);
  plane(width * 0.9, height * 0.3);
  pop();
  
  // Update and display bubbles
  for (let i = bubbles.length - 1; i >= 0; i--) {
    let b = bubbles[i];
    b.update();
    b.display();
    
    if (b.isFinished()) {
      bubbles.splice(i, 1);
    }
  }
  
  // Update and display steam
  for (let i = steam.length - 1; i >= 0; i--) {
    let s = steam[i];
    s.update();
    s.display();
    
    if (s.isFinished()) {
      steam.splice(i, 1);
    }
  }
  
  // Add new bubbles occasionally
  if (frameCount % 5 === 0 && random() > 0.3) {
    bubbles.push(new Bubble(random(-width/2, width/2), height/2 - 100));
  }
  
  // Add steam occasionally
  if (frameCount % 3 === 0 && random() > 0.7) {
    steam.push(new Steam(random(-width/2, width/2), waterLevel - height/2));
  }
  
  // Increase heat over time (rhythmically)
  heat = map(sin(frameCount * 0.02), -1, 1, 0.5, 1.5);
  
  // Update ripple effect
  rippleOffset += 0.02;
}

function mousePressed() {
  heat += 0.5;
  if (heat > 3) heat = 3;
  
  // Add more bubbles on click
  for (let i = 0; i < 10; i++) {
    bubbles.push(new Bubble(random(-width/2, width/2), height/2 - 100));
  }
}

class Bubble {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.z = random(-50, 50);
    this.size = random(5, 15);
    this.speed = random(0.5, 2) * heat;
    this.alpha = random(100, 200);
    this.growthRate = random(0.1, 0.5);
  }
  
  update() {
    this.y -= this.speed;
    this.size += this.growthRate;
    this.x += sin(this.z * 0.01 + frameCount * 0.02) * 0.5;
    this.z += random(-0.5, 0.5);
  }
  
  display() {
    push();
    translate(this.x, this.y, this.z);
    fill(255, 255, 255, this.alpha);
    sphere(this.size * 0.5);
    pop();
  }
  
  isFinished() {
    return this.y < -height/2 || this.size > 40;
  }
}

class Steam {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.z = random(-50, 50);
    this.size = random(10, 30);
    this.speed = random(0.5, 1.5) * heat;
    this.alpha = random(100, 200);
    this.wind = random(-0.5, 0.5);
    this.growthRate = random(0.05, 0.2);
  }
  
  update() {
    this.y -= this.speed;
    this.x += this.wind;
    this.z += random(-0.5, 0.5);
    this.size += this.growthRate;
  }
  
  display() {
    push();
    translate(this.x, this.y, this.z);
    fill(255, 255, 255, this.alpha);
    sphere(this.size * 0.5);
    pop();
  }
  
  isFinished() {
    return this.y < -height/2 || this.size > 80;
  }
}
