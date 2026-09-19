let orbs = [];
const MAX_ORBS = 150;

function setup() {
  createCanvas(400, 400);
  colorMode(HSB, 360, 100, 100, 100);
  
  for (let i = 0; i < 20; i++) {
    orbs.push(new Orb());
  }
}

function draw() {
  // Subtle dark background with slight variation
  const bgHue = 20;
  const bgSat = 5;
  const bgBri = 2;
  set(bgHue, bgSat, bgBri, 95);
  
  // Update and display orbs
  for (let i = orbs.length - 1; i >= 0; i--) {
    orbs[i].update();
    orbs[i].display();
    
    if (orbs[i].isDead()) {
      orbs.splice(i, 1);
    }
  }
  
  // Occasionally spawn new orbs
  if (frameCount % 120 === 0 && orbs.length < MAX_ORBS) {
    orbs.push(new Orb());
  }
  
  // Remove oldest orbs if over limit
  while (orbs.length > MAX_ORBS) {
    orbs.shift();
  }
}

class Orb {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.vx = random(-0.2, 0.2);
    this.vy = random(-0.2, 0.2);
    this.baseRadius = random(20, 80);
    this.radius = this.baseRadius;
    this.phase = random(TWO_PI);
    this.hue = (frameCount / 10 + random(180, 360)) % 360;
    this.alpha = random(70, 95);
    this.decay = 0;
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy;
    
    // Ripple effect
    this.phase += 0.02;
    this.radius = this.baseRadius + sin(this.phase) * 15;
    
    // Bounce off edges
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
    
    // Gradual fade
    this.decay += 0.005;
    if (this.decay > 1) this.decay = 1;
  }
  
  display() {
    const brightness = 80 + sin(this.phase) * 10;
    const alphaVal = this.alpha * (1 - this.decay * 0.5);
    
    // Draw glow effect
    for (let r = this.radius * 1.5; r > this.radius; r -= 5) {
      const alphaStep = alphaVal / (this.radius * 1.5) * (r - this.radius);
      const b = brightness * (1 - (r - this.radius) / (this.radius * 1.5) * 0.5);
      set(hue(this.hue), 60, b, alphaStep * 0.3);
      noStroke();
      fill(hue(this.hue), 60, b, alphaStep * 0.3);
      ellipse(this.x, this.y, r * 2);
    }
    
    // Core
    set(hue(this.hue), 80, brightness, alphaVal);
    noStroke();
    fill(hue(this.hue), 80, brightness, alphaVal);
    ellipse(this.x, this.y, this.radius);
  }
  
  isDead() {
    return this.decay >= 1;
  }
}
