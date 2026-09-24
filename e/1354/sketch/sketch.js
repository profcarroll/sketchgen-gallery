let bubbles = [];
let steam = [];
let waterLevel;
let heat = 0;

function setup() {
  createCanvas(400, 400);
  waterLevel = height * 0.7;
  noStroke();
}

function draw() {
  background(10, 15, 60);
  
  // Draw water surface
  fill(20, 30, 90, 180);
  rect(0, waterLevel, width, height - waterLevel);
  
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
    bubbles.push(new Bubble(random(width), height));
  }
  
  // Add steam occasionally
  if (frameCount % 3 === 0 && random() > 0.7) {
    steam.push(new Steam(random(width), waterLevel));
  }
  
  // Increase heat over time (rhythmically)
  heat = map(sin(frameCount * 0.02), -1, 1, 0.5, 1.5);
}

function mousePressed() {
  heat += 0.5;
  if (heat > 3) heat = 3;
  
  // Add more bubbles on click
  for (let i = 0; i < 10; i++) {
    bubbles.push(new Bubble(random(width), height));
  }
}

class Bubble {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(5, 15);
    this.speed = random(0.5, 2) * heat;
    this.alpha = random(100, 200);
    this.growthRate = random(0.1, 0.5);
  }
  
  update() {
    this.y -= this.speed;
    this.size += this.growthRate;
  }
  
  display() {
    fill(255, 255, 255, this.alpha);
    ellipse(this.x, this.y, this.size);
  }
  
  isFinished() {
    return this.y < -this.size || this.size > 40;
  }
}

class Steam {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(10, 30);
    this.speed = random(0.5, 1.5) * heat;
    this.alpha = random(100, 200);
    this.wind = random(-0.5, 0.5);
    this.growthRate = random(0.05, 0.2);
  }
  
  update() {
    this.y -= this.speed;
    this.x += this.wind;
    this.size += this.growthRate;
  }
  
  display() {
    fill(255, 255, 255, this.alpha);
    ellipse(this.x, this.y, this.size);
  }
  
  isFinished() {
    return this.y < -this.size || this.size > 80;
  }
}
