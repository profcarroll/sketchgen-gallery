let rings = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  // Initialize with one ring at center
  rings.push({
    x: width / 2,
    y: height / 2,
    radius: 0,
    alpha: 100,
    hue: 0
  });
}

function draw() {
  background(0, 0, 0, 1);
  
  // Update and draw rings
  for (let i = rings.length - 1; i >= 0; i--) {
    let ring = rings[i];
    
    // Grow the ring
    ring.radius += 2;
    
    // Fade out the ring
    ring.alpha -= 0.5;
    
    // Update hue for ripple effect
    ring.hue = (ring.hue + 0.5) % 360;
    
    // Draw the ring as a transparent ellipse
    fill(ring.hue, 80, 90, ring.alpha / 100);
    ellipse(ring.x, ring.y, ring.radius * 2, ring.radius * 2);
    
    // Remove rings that are fully faded out
    if (ring.alpha <= 0) {
      rings.splice(i, 1);
    }
  }
  
  // Add a new ring occasionally to create continuous ripple effect
  if (frameCount % 5 === 0) {
    rings.push({
      x: width / 2,
      y: height / 2,
      radius: 0,
      alpha: 100,
      hue: (frameCount * 2) % 360
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
