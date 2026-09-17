let rings = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Initialize rings with different properties
  for (let i = 0; i < 15; i++) {
    rings.push({
      radius: 0,
      maxRadius: random(200, 600),
      speed: random(0.2, 0.8),
      hue: random(360),
      alpha: random(100, 200)
    });
  }
}

function draw() {
  background(0);
  
  // Update and display each ring
  for (let i = 0; i < rings.length; i++) {
    let ring = rings[i];
    
    // Gradually expand the ring
    ring.radius += ring.speed;
    
    // Pulse the color intensity
    let pulse = sin(frameCount * 0.02 + i) * 50 + 100;
    fill(ring.hue, 100, 100, ring.alpha * pulse / 100);
    noStroke();
    
    // Draw the ring as a circle
    ellipse(width/2, height/2, ring.radius * 2);
    
    // Reset if ring is too large
    if (ring.radius > ring.maxRadius) {
      ring.radius = 0;
      ring.hue = (ring.hue + 10) % 360; // Shift hue for next cycle
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
