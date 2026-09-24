let skaters = [];
const trailLength = 100;
const numSkaters = 5;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Initialize skaters
  for (let i = 0; i < numSkaters; i++) {
    skaters.push({
      x: random(width),
      y: random(height),
      vx: random(-2, 2),
      vy: random(-2, 2),
      hue: random(200, 260), // Cool blues
      trail: []
    });
  }
}

function draw() {
  background(0, 0, 10, 0.05); // Semi-transparent background for trail fading
  
  // Update and draw skaters
  for (let s of skaters) {
    // Update position
    s.x += s.vx;
    s.y += s.vy;
    
    // Bounce off edges
    if (s.x < 0 || s.x > width) s.vx *= -1;
    if (s.y < 0 || s.y > height) s.vy *= -1;
    
    // Add current position to trail
    s.trail.push({x: s.x, y: s.y, age: 0});
    
    // Remove old points from trail
    if (s.trail.length > trailLength) {
      s.trail.shift();
    }
    
    // Draw trail
    beginShape();
    for (let i = 0; i < s.trail.length; i++) {
      const point = s.trail[i];
      const alpha = map(point.age, 0, trailLength, 0.8, 0);
      const size = map(point.age, 0, trailLength, 8, 2);
      fill(s.hue, 80, 90, alpha);
      vertex(point.x, point.y);
    }
    endShape();
    
    // Draw skater body
    fill(s.hue, 80, 90);
    ellipse(s.x, s.y, 12, 12);
    
    // Draw glowing effect around skater
    fill(s.hue, 80, 90, 0.2);
    ellipse(s.x, s.y, 20, 20);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
