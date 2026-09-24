let bubbles = [];
const MAX_BUBBLES = 200;
const MAX_DORA = 15;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 255);
  for (let i = 0; i < 50; i++) {
    bubbles.push(new Bubble());
  }
}

function draw() {
  background(20, 30, 60);
  
  // Update and display bubbles
  for (let i = bubbles.length - 1; i >= 0; i--) {
    const b = bubbles[i];
    b.update();
    b.show();
    if (b.offScreen()) {
      bubbles.splice(i, 1);
      if (bubbles.length < MAX_BUBBLES) {
        bubbles.push(new Bubble());
      }
    }
  }

  // Create frothy clusters at top
  const doraY = height * 0.7;
  let doraCount = 0;
  
  for (let i = 0; i < bubbles.length; i++) {
    const b = bubbles[i];
    if (b.y < doraY + b.size * 2 && b.y + b.size * 2 > doraY) {
      b.isDora = true;
      doraCount++;
    }
  }

  if (doraCount > MAX_DORA) {
    // Dissipate dora bubbles
    for (let i = bubbles.length - 1; i >= 0; i--) {
      if (bubbles[i].isDora && frameCount % 3 === 0) {
        bubbles[i].dissipate = true;
      }
    }
  }

  // Handle dissipation
  for (let i = bubbles.length - 1; i >= 0; i--) {
    if (bubbles[i].dissipate) {
      bubbles[i].size *= 0.7;
      if (bubbles[i].size < 0.5) {
        bubbles.splice(i, 1);
      }
    }
  }
}

class Bubble {
  constructor() {
    this.x = random(width);
    this.y = height + random(50, 150);
    this.size = random(4, 20);
    this.speed = random(0.2, 1.5);
    this.hue = 240;
    this.isDora = false;
    this.dissipate = false;
    this.noiseOffset = random(TWO_PI);
  }

  update() {
    if (this.dissipate) return;
    
    this.y -= this.speed;
    this.x += sin(frameCount * 0.01 + this.noiseOffset) * 0.3;
    
    if (this.isDora) {
      this.y -= this.speed * 1.5;
      this.x += cos(frameCount * 0.02 + this.noiseOffset) * random(-0.5, 0.5);
    }
  }

  show() {
    if (this.dissipate) return;
    
    if (this.isDora) {
      fill(255, 20, 90, 150);
      noStroke();
    } else {
      fill(this.hue, 200, 255, 150);
      stroke(255, 255, 255, 100);
      strokeWeight(0.5);
    }
    
    const wave = sin(frameCount * 0.05 + this.x * 0.01) * 2;
    ellipse(this.x + wave, this.y, this.size, this.size + abs(wave));
  }

  offScreen() {
    return this.y < -100 || this.size < 0.5;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
