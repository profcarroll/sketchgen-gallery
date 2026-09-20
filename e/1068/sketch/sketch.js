let ripples = [];
let audioContext;

function setup() {
  createCanvas(400, 400);
  noStroke();
  fill(255, 200);
}

function draw() {
  background(20, 30, 40);
  
  for (let i = ripples.length - 1; i >= 0; i--) {
    let ripple = ripples[i];
    ripple.update();
    ripple.display();
    
    if (ripple.isFinished()) {
      ripples.splice(i, 1);
    }
  }
}

function mousePressed() {
  // Start audio context on first user interaction
  if (!audioContext) {
    userStartAudio();
    audioContext = getAudioContext();
  }
  
  ripples.push(new Ripple(mouseX, mouseY));
  
  // Play a soft chime sound
  let osc = new p5.Oscillator('sine');
  osc.freq(440);
  osc.amp(0.3);
  osc.start();
  osc.stop(millis() + 200);
}

class Ripple {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 0;
    this.maxRadius = 150;
    this.alpha = 200;
    this.speed = 2;
    this.shrinkSpeed = 0.5;
    this.phase = 0;
  }
  
  update() {
    this.radius += this.speed;
    this.phase += 0.1;
    
    // Start shrinking when we reach max radius
    if (this.radius > this.maxRadius) {
      this.alpha -= this.shrinkSpeed * 10;
      this.radius -= this.shrinkSpeed;
    }
  }
  
  display() {
    // Create a fluctuating ripple pattern
    let fluctuation = sin(this.phase) * 10;
    let currentRadius = this.radius + fluctuation;
    
    noFill();
    stroke(255, this.alpha);
    strokeWeight(2);
    
    // Draw multiple concentric circles for the ripple effect
    for (let i = 0; i < 3; i++) {
      let r = currentRadius - i * 5;
      if (r > 0) {
        ellipse(this.x, this.y, r * 2);
      }
    }
  }
  
  isFinished() {
    return this.alpha <= 0 || this.radius < 0;
  }
}
