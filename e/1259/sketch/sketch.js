let balloons = [];
const BALLOON_COUNT = 5;
const SPEED = 1;

class Balloon {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = random(30, 50);
    this.vx = random(-0.1, 0.1);
    
    const colors = [
      { h: 20, s: 90, b: 90 },
      { h: 10, s: 95, b: 85 },
      { h: 35, s: 85, b: 95 },
      { h: 15, s: 85, b: 88 }
    ];
    this.col = random(colors);
  }
  
  display() {
    colorMode(HSB, 360, 100, 100);
    fill(this.col.h, this.col.s, this.col.b);
    noStroke();
    ellipse(this.x, this.y, this.r * 2, this.r * 2.2);
    
    fill(this.col.h + 30, this.col.s / 2, 100, 60);
    ellipse(this.x - this.r * 0.25, this.y - this.r * 0.35, this.r * 0.5, this.r * 0.7);
    
    stroke(120);
    strokeWeight(1);
    line(this.x - this.r * 0.15, this.y + this.r, this.x - this.r * 0.2, this.y + this.r + 40);
    line(this.x + this.r * 0.15, this.y + this.r, this.x + this.r * 0.2, this.y + this.r + 40);
    
    fill(160, 30, 50);
    rect(this.x - this.r * 0.25, this.y + this.r + 40, this.r * 0.5, this.r * 0.4);
  }
  
  update() {
    this.y -= SPEED;
    this.x += this.vx;
  }
  
  isDone() {
    return this.y < -this.r * 3;
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  for (let i = 0; i < BALLOON_COUNT; i++) {
    let x = random(width * 0.15, width * 0.85);
    let y = random(height * 0.2, height);
    balloons.push(new Balloon(x, y));
  }
}

function draw() {
  colorMode(HSB, 360, 100, 100);
  background(50, 50, 90);
  
  fill(0, 0, 100, 10);
  for (let i = 0; i < 3; i++) {
    let cy = height * 0.2 + i * height * 0.25 + sin(frameCount * 0.001 + i) * 10;
    ellipse(width * 0.3, cy, width * 0.4, height * 0.1);
    ellipse(width * 0.7, cy + 50, width * 0.5, height * 0.1);
  }
  
  for (let i = balloons.length - 1; i >= 0; i--) {
    balloons[i].update();
    balloons[i].display();
    
    if (balloons[i].isDone()) {
      balloons.splice(i, 1);
    }
  }
  
  while (balloons.length < BALLOON_COUNT) {
    let x = random(width * 0.15, width * 0.85);
    balloons.push(new Balloon(x, height + 100));
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
