let rings = [];
let maxRings = 200;
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
  if (frameCount % 2 === 0 && rings.length < maxRings) {
    rings.push({
      radius: 0,
      maxRadius: random(300, 600),
      speed: random(1.2, 3.0),
      hue: random(360),
      alpha: random(0.5, 0.9),
      phase: random(TWO_PI)
    });
  }
  
  // Update and draw rings
  for (let i = rings.length - 1; i >= 0; i--) {
    let ring = rings[i];
    
    // Expand the ring
    ring.radius += ring.speed;
    
    // Create ripple effect with sine wave
    let ripple = sin(time * 8 + ring.radius * 0.02 + ring.phase) * 12;
    
    // Add a subtle color shift over time
    let hueShift = sin(time * 0.3 + ring.radius * 0.015) * 30;
    let currentHue = (ring.hue + hueShift) % 360;
    
    // Draw the ring with a wavy edge and dynamic color
    fill(currentHue, 100, 90, ring.alpha);
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.03) {
      let r = ring.radius + ripple;
      let x = width/2 + r * cos(a);
      let y = height/2 + r * sin(a);
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Fade out as ring grows
    ring.alpha *= 0.975;
    
    // Remove rings that are too large or faded
    if (ring.radius > ring.maxRadius || ring.alpha < 0.03) {
      rings.splice(i, 1);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
