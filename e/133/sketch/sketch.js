let circles = [];
let stars = [];
let rippleEffects = [];

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create floating circles
  for (let i = 0; i < 150; i++) {
    circles.push({
      x: random(width),
      y: random(height),
      size: random(20, 100),
      speed: random(0.2, 0.8),
      hue: random(360),
      alpha: random(0.05, 0.15)
    });
  }
  
  // Create pointillist stars
  for (let i = 0; i < 300; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(0.5, 3),
      speed: random(0.1, 0.5),
      hue: random(360),
      alpha: random(0.2, 1),
      pulseSpeed: random(0.02, 0.05),
      pulsePhase: random(TWO_PI)
    });
  }
}

function draw() {
  background(220, 5, 5); // Dark cosmic background
  
  // Update and display circles
  for (let i = 0; i < circles.length; i++) {
    let c = circles[i];
    
    // Move circles horizontally
    c.x += c.speed;
    
    // Wrap around screen
    if (c.x > width + c.size) c.x = -c.size;
    
    // Draw translucent circle with gradient
    noFill();
    stroke(c.hue, 80, 90, c.alpha);
    strokeWeight(1);
    ellipse(c.x, c.y, c.size);
    
    // Add subtle inner glow
    stroke(c.hue, 60, 100, c.alpha * 0.3);
    strokeWeight(2);
    ellipse(c.x, c.y, c.size * 0.7);
  }
  
  // Update and display stars
  for (let i = 0; i < stars.length; i++) {
    let s = stars[i];
    
    // Move stars in opposite direction to circles
    s.x -= s.speed;
    
    // Wrap around screen
    if (s.x < -s.size) s.x = width + s.size;
    
    // Pulsing effect
    let pulse = sin(frameCount * s.pulseSpeed + s.pulsePhase) * 0.5 + 0.5;
    let starSize = s.size * pulse;
    
    // Draw star with brightness
    fill(s.hue, 100, 100, s.alpha);
    noStroke();
    ellipse(s.x, s.y, starSize);
    
    // Add a subtle glow
    fill(s.hue, 100, 100, s.alpha * 0.2);
    ellipse(s.x, s.y, starSize * 3);
  }
  
  // Check for collisions between stars and circles
  for (let i = 0; i < stars.length; i++) {
    let s = stars[i];
    for (let j = 0; j < circles.length; j++) {
      let c = circles[j];
      
      let d = dist(s.x, s.y, c.x, c.y);
      
      if (d < c.size * 0.5) {
        // Create ripple effect
        rippleEffects.push({
          x: s.x,
          y: s.y,
          size: 0,
          max: random(30, 60),
          alpha: 0.8,
          hue: c.hue
        });
      }
    }
  }
  
  // Update and display ripples
  for (let i = rippleEffects.length - 1; i >= 0; i--) {
    let r = rippleEffects[i];
    
    r.size += 2;
    r.alpha -= 0.02;
    
    if (r.alpha <= 0) {
      rippleEffects.splice(i, 1);
      continue;
    }
    
    noFill();
    stroke(r.hue, 80, 90, r.alpha);
    strokeWeight(1);
    ellipse(r.x, r.y, r.size);
  }
}
