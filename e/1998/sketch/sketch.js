let rings = [];
let maxRings = 150;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
}

function draw() {
  background(0, 0, 0, 1);
  
  time += 0.01;
  
  // Add new ring occasionally
  if (frameCount % 3 === 0 && rings.length < maxRings) {
    rings.push({
      radius: 0,
      maxRadius: random(200, 500),
      speed: random(0.8, 2.5),
      hue: random(360),
      alpha: random(0.4, 0.8),
      phase: random(TWO_PI)
    });
  }
  
  // Update and draw rings
  for (let i = rings.length - 1; i >= 0; i--) {
    let ring = rings[i];
    
    // Expand the ring
    ring.radius += ring.speed;
    
    // Create ripple effect with sine wave
    let ripple = sin(time * 7 + ring.radius * 0.03 + ring.phase) * 8;
    
    // Add a subtle color shift over time
    let hueShift = sin(time * 0.5 + ring.radius * 0.01) * 20;
    let currentHue = (ring.hue + hueShift) % 360;
    
    // Draw the ring with a wavy edge and dynamic color
    fill(currentHue, 90, 80, ring.alpha);
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.05) {
      let x = width/2 + (ring.radius + ripple) * cos(a);
      let y = height/2 + (ring.radius + ripple) * sin(a);
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Fade out as ring grows
    ring.alpha *= 0.98;
    
    // Remove rings that are too large or faded
    if (ring.radius > ring.maxRadius || ring.alpha < 0.05) {
      rings.splice(i, 1);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
