let pulses = [];
let maxPulses = 10;
let pulseSpeed = 2;

function setup() {
  createCanvas(400, 400);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
}

function draw() {
  background(0, 0, 0);

  // Draw existing pulses
  for (let i = pulses.length - 1; i >= 0; i--) {
    let p = pulses[i];
    p.update();
    p.display();
    
    if (p.isFinished()) {
      pulses.splice(i, 1);
    }
  }

  // Add new pulse every few frames
  if (frameCount % 30 === 0 && pulses.length < maxPulses) {
    pulses.push(new Pulse(width/2, height/2));
  }
}

class Pulse {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 0;
    this.maxRadius = 300;
    this.alpha = 1;
    this.hue = frameCount * 2 % 360;
  }

  update() {
    this.radius += pulseSpeed;
    this.alpha = map(this.radius, 0, this.maxRadius, 1, 0);
  }

  display() {
    fill(this.hue, 100, 100, this.alpha);
    ellipse(this.x, this.y, this.radius * 2);
  }

  isFinished() {
    return this.radius > this.maxRadius;
  }
}
