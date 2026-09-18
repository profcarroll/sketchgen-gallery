let rings = [];
let maxRings = 200;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  // Initialize rings
  for (let i = 0; i < maxRings; i++) {
    rings.push({
      radius: 0,
      speed: random(0.5, 2),
      hue: random(360),
      amp: random(10, 50),
      freq: random(0.01, 0.05)
    });
  }
}

function draw() {
  background(0, 0, 0, 0.05); // Semi-transparent background for trail effect
  time += 0.02;

  // Draw rings
  for (let i = 0; i < rings.length; i++) {
    let ring = rings[i];
    
    // Update radius with ripple effect
    ring.radius += ring.speed;
    
    // Create wave distortion using sine and cosine
    let distortion = sin(time * ring.freq + ring.radius * 0.01) * ring.amp;
    let r = ring.radius + distortion;
    
    // Update hue for fluorescent color effect
    ring.hue = (ring.hue + 0.5) % 360;
    
    // Draw the ring with dynamic color
    fill(ring.hue, 100, 100, 0.7);
    ellipse(width/2, height/2, r*2, r*2);
  }
  
  // Remove old rings and add new ones if needed
  if (rings.length > maxRings) {
    rings.splice(0, 1);
  }
  
  if (rings[rings.length - 1].radius > min(width, height) * 0.5) {
    rings.push({
      radius: 0,
      speed: random(0.5, 2),
      hue: random(360),
      amp: random(10, 50),
      freq: random(0.01, 0.05)
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
