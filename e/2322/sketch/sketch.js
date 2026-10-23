let ripples = [];
const numRipples = 150;
const maxRadius = 300;
const minRadius = 50;
const rippleSpeed = 0.2;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Initialize ripples
  for (let i = 0; i < numRipples; i++) {
    ripples.push({
      x: random(width),
      y: random(height),
      radius: random(minRadius, maxRadius),
      speed: random(rippleSpeed * 0.5, rippleSpeed * 1.5),
      angle: random(TWO_PI),
      opacity: random(30, 80),
      noiseOffset: random(1000)
    });
  }
}

function draw() {
  background(20, 30, 60);
  
  time += 0.01;
  
  // Draw cut-paper fragments
  for (let i = 0; i < numRipples; i++) {
    let ripple = ripples[i];
    
    // Update ripple position with organic noise
    ripple.angle += (noise(ripple.noiseOffset + time * 0.02) - 0.5) * 0.01;
    ripple.x += cos(ripple.angle) * 0.3;
    ripple.y += sin(ripple.angle) * 0.3;
    
    // Update radius
    ripple.radius += ripple.speed;
    
    // Reset if ripple is too large or out of bounds
    if (ripple.radius > maxRadius * 2 || 
        ripple.x < -50 || ripple.x > width + 50 ||
        ripple.y < -50 || ripple.y > height + 50) {
      ripple.x = random(width);
      ripple.y = random(height);
      ripple.radius = random(minRadius, maxRadius);
      ripple.angle = random(TWO_PI);
    }
    
    // Draw the ripple fragment
    noStroke();
    fill(255, 255, 255, ripple.opacity);
    
    // Draw a soft, irregular shape to simulate cut paper
    push();
    translate(ripple.x, ripple.y);
    beginShape();
    let sides = floor(random(5, 10));
    for (let j = 0; j < sides; j++) {
      let angle = map(j, 0, sides, 0, TWO_PI);
      let radiusVariation = ripple.radius * (0.8 + noise(ripple.noiseOffset + time + j) * 0.4);
      let x = cos(angle) * radiusVariation;
      let y = sin(angle) * radiusVariation;
      vertex(x, y);
    }
    endShape(CLOSE);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
