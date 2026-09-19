let ripples = [];
let audioContext;

function setup() {
  createCanvas(400, 400);
  noStroke();
  fill(255, 200);
}

function draw() {
  background(0);
  
  // Draw all active ripples
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
    audioContext = getAudioContext();
    userStartAudio();
  }
  
  // Create a new ripple at the click point
  ripples.push(new Ripple(mouseX, mouseY));
  
  // Play chime sound
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
    this.pulseCount = 0;
    this.maxPulses = 2;
    this.pulseInterval = 30; // frames between pulses
    this.frameCount = 0;
  }
  
  update() {
    this.radius += 2;
    this.frameCount++;
    
    // Pulse effect: increase intensity and size for a few frames
    if (this.frameCount % this.pulseInterval === 0 && this.pulseCount < this.maxPulses) {
      this.pulseCount++;
      this.alpha = min(255, this.alpha + 50);
    }
    
    // Gradually fade out
    this.alpha *= 0.96;
  }
  
  display() {
    if (this.radius > this.maxRadius) return;
    
    let alpha = map(this.alpha, 0, 255, 0, 200);
    fill(255, alpha);
    noStroke();
    ellipse(this.x, this.y, this.radius * 2);
  }
  
  isFinished() {
    return this.alpha < 10 || this.radius > this.maxRadius;
  }
}
