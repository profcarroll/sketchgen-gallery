let ripples = [];
let audioReady = false;

function setup() {
  createCanvas(400, 400);
  background(240);
}

function draw() {
  background(240);
  
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
  if (!audioReady) {
    userStartAudio();
    audioReady = true;
  }
  
  let x = mouseX;
  let y = mouseY;
  ripples.push(new Ripple(x, y));
  
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
    this.alpha = 255;
    this.pulseCount = 0;
    this.pulseMax = 2;
    this.pulseSpeed = 0.05;
    this.dissipationSpeed = 0.5;
    this.isDissipating = false;
  }
  
  update() {
    if (!this.isDissipating) {
      this.radius += 2;
      
      if (this.radius > this.maxRadius / 2 && this.pulseCount < this.pulseMax) {
        this.isDissipating = true;
        this.radius = this.maxRadius / 2;
        this.pulseCount++;
      }
    } else {
      this.radius += 3;
      this.alpha -= this.dissipationSpeed * 5;
      
      if (this.radius > this.maxRadius) {
        this.alpha -= this.dissipationSpeed;
      }
    }
  }
  
  display() {
    noFill();
    stroke(100, this.alpha * 0.7);
    strokeWeight(2);
    
    // Draw main ripple
    ellipse(this.x, this.y, this.radius * 2);
    
    // Draw secondary ripple when pulsing
    if (this.isDissipating && this.pulseCount < this.pulseMax) {
      stroke(150, this.alpha * 0.3);
      ellipse(this.x, this.y, (this.radius + 20) * 2);
    }
    
    // Draw the faint ring that remains briefly
    if (this.alpha < 100 && this.alpha > 0) {
      stroke(200, this.alpha * 0.2);
      strokeWeight(1);
      ellipse(this.x, this.y, this.radius * 1.5);
    }
  }
  
  isFinished() {
    return this.alpha <= 0;
  }
}
