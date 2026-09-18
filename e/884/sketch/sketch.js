let drops = [];
let liquidLevel = 0;
let gravity = 0.2;
let viscosity = 0.98;
let rippleCount = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  rectMode(CENTER);
}

function draw() {
  background(200, 10, 95); // Neutral background
  
  // Draw glass container
  fill(240, 5, 90, 0.1);
  stroke(240, 10, 80, 0.3);
  strokeWeight(2);
  rect(width/2, height/2, width*0.6, height*0.8);
  
  // Draw liquid in container
  fill(240, 90, 70, 0.7);
  noStroke();
  rect(width/2, height/2, width*0.55, liquidLevel);
  
  // Update and draw drops
  for (let i = drops.length - 1; i >= 0; i--) {
    let drop = drops[i];
    drop.update();
    drop.display();
    
    if (drop.y > height/2 + liquidLevel/2 - 30) {
      createRipple(drop.x, drop.y);
      drops.splice(i, 1);
    }
  }
  
  // Add new drops occasionally
  if (frameCount % 5 === 0 && drops.length < 100) {
    drops.push(new Drop());
  }
  
  // Rise liquid level
  liquidLevel += 0.2;
  
  // Draw ripples
  if (rippleCount > 0) {
    for (let i = ripples.length - 1; i >= 0; i--) {
      ripples[i].update();
      ripples[i].display();
      if (ripples[i].alpha <= 0) {
        ripples.splice(i, 1);
        rippleCount--;
      }
    }
  }
  
  // Draw liquid distortion effect
  drawDistortion();
}

function drawDistortion() {
  // Simple distortion of background around liquid surface
  let distortionAmount = map(liquidLevel, 0, height*0.4, 0, 2);
  if (distortionAmount > 0) {
    for (let i = 0; i < 100; i++) {
      let x = random(width);
      let y = height/2 + liquidLevel/2;
      let dx = random(-distortionAmount, distortionAmount);
      let dy = random(-distortionAmount, distortionAmount);
      fill(240, 5, 95, 0.1);
      ellipse(x + dx, y + dy, 10, 10);
    }
  }
}

function createRipple(x, y) {
  if (rippleCount < 10) {
    ripples.push(new Ripple(x, y));
    rippleCount++;
  }
}

class Drop {
  constructor() {
    this.x = width/2 + random(-width*0.2, width*0.2);
    this.y = -20;
    this.size = random(3, 8);
    this.color = color(random(180, 240), 90, 70, 0.8);
    this.vx = random(-1, 1) * 0.5;
    this.vy = 0;
  }
  
  update() {
    this.vy += gravity;
    this.x += this.vx;
    this.y += this.vy;
    
    // Slow down due to viscosity
    this.vx *= viscosity;
    this.vy *= viscosity;
  }
  
  display() {
    fill(this.color);
    ellipse(this.x, this.y, this.size, this.size);
  }
}

class Ripple {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 0;
    this.alpha = 0.8;
    this.growthRate = 2;
  }
  
  update() {
    this.radius += this.growthRate;
    this.alpha -= 0.01;
  }
  
  display() {
    noFill();
    stroke(240, 30, 90, this.alpha);
    strokeWeight(1);
    ellipse(this.x, this.y, this.radius * 2);
  }
}

let ripples = [];

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
