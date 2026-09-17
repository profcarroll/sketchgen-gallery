let waves = [];
let magnet;
let fieldLines = [];

function setup() {
  createCanvas(500, 500);
  magnet = {
    x: width / 2,
    y: height / 2,
    radius: 100
  };
  
  // Generate magnetic field lines
  for (let i = 0; i < 20; i++) {
    let angle = map(i, 0, 20, 0, TWO_PI);
    let x = magnet.x + cos(angle) * magnet.radius;
    let y = magnet.y + sin(angle) * magnet.radius;
    fieldLines.push({
      x: x,
      y: y,
      angle: angle
    });
  }
  
  noStroke();
}

function draw() {
  background(20);
  
  // Draw magnet
  fill(150, 150, 150);
  ellipse(magnet.x, magnet.y, magnet.radius * 2, magnet.radius * 2);
  
  // Draw field lines around magnet
  stroke(100, 150, 255, 100);
  strokeWeight(1);
  for (let i = 0; i < fieldLines.length; i++) {
    let fl = fieldLines[i];
    let x = magnet.x + cos(fl.angle) * magnet.radius;
    let y = magnet.y + sin(fl.angle) * magnet.radius;
    line(magnet.x, magnet.y, x, y);
  }
  
  // Update and display waves
  for (let i = waves.length - 1; i >= 0; i--) {
    let w = waves[i];
    w.update();
    w.display();
    
    if (w.isFinished()) {
      waves.splice(i, 1);
    }
  }
  
  // Add new wave periodically
  if (frameCount % 30 === 0) {
    waves.push(new Wave(magnet.x, magnet.y));
  }
}

class Wave {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 0;
    this.alpha = 255;
    this.growth = 3;
    this.color = color(100, 200, 255, this.alpha);
  }
  
  update() {
    this.radius += this.growth;
    this.alpha -= 2;
    this.color.setAlpha(this.alpha);
  }
  
  display() {
    noFill();
    stroke(this.color);
    strokeWeight(1);
    ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
  }
  
  isFinished() {
    return this.alpha <= 0;
  }
}
