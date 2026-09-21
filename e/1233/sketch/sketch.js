let rings = [];
let maxRings = 100;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
}

function draw() {
  background(0, 0, 0, 1);
  
  time += 0.02;
  
  // Add new ring occasionally
  if (frameCount % 5 === 0 && rings.length < maxRings) {
    rings.push({
      radius: 0,
      maxRadius: random(100, 300),
      speed: random(0.5, 2),
      hue: random(360),
      alpha: random(0.3, 0.7)
    });
  }
  
  // Update and draw rings
  for (let i = rings.length - 1; i >= 0; i--) {
    let ring = rings[i];
    
    // Expand the ring
    ring.radius += ring.speed;
    
    // Create ripple effect with sine wave
    let ripple = sin(time * 5 + ring.radius * 0.02) * 5;
    
    // Draw the ring with a wavy edge
    fill(ring.hue, 80, 90, ring.alpha);
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.05) {
      let x = width/2 + (ring.radius + ripple) * cos(a);
      let y = height/2 + (ring.radius + ripple) * sin(a);
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Remove rings that are too large
    if (ring.radius > ring.maxRadius) {
      rings.splice(i, 1);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
