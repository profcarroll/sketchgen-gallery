let skaters = [];
const trailLength = 150;
const numSkaters = 8;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Initialize skaters with varied hues for emerald/copper palette
  for (let i = 0; i < numSkaters; i++) {
    skaters.push({
      x: random(width),
      y: random(height),
      vx: random(-1.5, 1.5),
      vy: random(-1.5, 1.5),
      hue: random(80, 120), // Emerald green range
      trail: []
    });
  }
}

function draw() {
  background(0, 0, 0, 0.1); // Dark background with slight fade
  
  // Update and draw skaters
  for (let s of skaters) {
    // Update position
    s.x += s.vx;
    s.y += s.vy;
    
    // Bounce off edges with some damping
    if (s.x < 0 || s.x > width) {
      s.vx *= -0.95;
      s.x = constrain(s.x, 0, width);
    }
    if (s.y < 0 || s.y > height) {
      s.vy *= -0.95;
      s.y = constrain(s.y, 0, height);
    }
    
    // Add current position to trail
    s.trail.push({x: s.x, y: s.y, age: 0});
    
    // Remove old points from trail
    if (s.trail.length > trailLength) {
      s.trail.shift();
    }
    
    // Update trail ages
    for (let point of s.trail) {
      point.age++;
    }
    
    // Draw trail with fading and glow effect
    beginShape();
    for (let i = 0; i < s.trail.length; i++) {
      const point = s.trail[i];
      const alpha = map(point.age, 0, trailLength, 0.9, 0);
      const size = map(point.age, 0, trailLength, 6, 1);
      
      // Use emerald green and copper hues for trails
      const hue = lerpColor(color(s.hue, 80, 90), color(30, 100, 90), point.age / trailLength);
      fill(hue, 80, 90, alpha);
      vertex(point.x, point.y);
    }
    endShape();
    
    // Draw skater body
    fill(s.hue, 80, 90);
    ellipse(s.x, s.y, 10, 10);
    
    // Draw glowing effect around skater
    fill(s.hue, 80, 90, 0.3);
    ellipse(s.x, s.y, 16, 16);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
