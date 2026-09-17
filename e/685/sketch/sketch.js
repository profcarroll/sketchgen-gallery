let rings = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Initialize rings with varying properties
  for (let i = 0; i < 20; i++) {
    rings.push({
      radius: 0,
      maxRadius: random(200, 600),
      speed: random(0.5, 2),
      angle: random(TWO_PI),
      color: color(random(100, 255), random(100, 255), random(255), 200),
      ripplePhase: random(TWO_PI)
    });
  }
}

function draw() {
  background(0);
  
  // Draw each ring
  for (let i = 0; i < rings.length; i++) {
    let ring = rings[i];
    
    // Update radius based on speed and time
    ring.radius += ring.speed;
    
    // Add ripple effect using sine wave
    let rippleOffset = sin(ring.ripplePhase) * 10;
    ring.ripplePhase += 0.05;
    
    // Draw the ring with a glow effect
    noFill();
    stroke(ring.color);
    strokeWeight(2);
    
    // Draw multiple concentric circles to simulate ripple
    for (let j = 0; j < 3; j++) {
      let r = ring.radius + rippleOffset * (j + 1);
      ellipse(width / 2, height / 2, r * 2, r * 2);
    }
    
    // Reset if ring is too large
    if (ring.radius > ring.maxRadius) {
      ring.radius = 0;
      ring.angle = random(TWO_PI);
      ring.color = color(random(100, 255), random(100, 255), random(255), 200);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
