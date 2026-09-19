let rings = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Initialize rings with starting properties
  for (let i = 0; i < 20; i++) {
    rings.push({
      radius: 0,
      speed: random(0.5, 1.5),
      amplitude: random(5, 20),
      frequency: random(0.01, 0.03),
      phase: random(TWO_PI),
      color: color(random(100, 255), random(100, 255), random(200, 255), 150)
    });
  }
}

function draw() {
  background(0);
  
  // Draw all rings
  for (let i = 0; i < rings.length; i++) {
    let ring = rings[i];
    
    // Update radius with ripple effect
    ring.radius += ring.speed;
    
    // Calculate ripple offset using sine wave
    let rippleOffset = sin(frameCount * ring.frequency + ring.phase) * ring.amplitude;
    
    // Draw the ring with ripple effect
    stroke(ring.color);
    noFill();
    ellipse(width/2, height/2, ring.radius + rippleOffset, ring.radius + rippleOffset);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
