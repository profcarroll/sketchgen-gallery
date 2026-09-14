let circles = [];
let ripple = null;

function setup() {
  createCanvas(400, 400);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  for (let i = 0; i < 200; i++) {
    circles.push({
      x: random(width),
      y: random(height),
      size: random(20, 80),
      speed: random(0.2, 0.8),
      hue: random(360),
      alpha: random(0.05, 0.2),
      sway: random(TWO_PI)
    });
  }
}

function draw() {
  background(0);
  
  // Update and display circles
  for (let i = 0; i < circles.length; i++) {
    let c = circles[i];
    
    // Slow upward movement
    c.y -= c.speed;
    
    // Add subtle horizontal sway
    c.x += sin(c.sway) * 0.2;
    c.sway += 0.02;
    
    // Wrap around the bottom
    if (c.y < -c.size) {
      c.y = height + c.size;
      c.x = random(width);
    }
    
    // Draw the circle with glow effect
    fill(c.hue, 80, 90, c.alpha);
    ellipse(c.x, c.y, c.size);
    
    // Add a subtle inner glow
    fill(c.hue, 50, 100, c.alpha * 0.3);
    ellipse(c.x, c.y, c.size * 0.6);
  }
  
  // Handle ripple effect if exists
  if (ripple) {
    ripple.radius += 5;
    ripple.alpha -= 0.02;
    
    if (ripple.alpha > 0) {
      stroke(200, 50, 80, ripple.alpha);
      noFill();
      ellipse(ripple.x, ripple.y, ripple.radius);
    } else {
      ripple = null;
    }
  }
}

function mousePressed() {
  // Create ripple at mouse position
  ripple = {
    x: mouseX,
    y: mouseY,
    radius: 0,
    alpha: 0.8
  };
  
  // Displace nearby circles
  for (let i = 0; i < circles.length; i++) {
    let c = circles[i];
    let d = dist(mouseX, mouseY, c.x, c.y);
    
    if (d < 150) {
      let angle = atan2(c.y - mouseY, c.x - mouseX);
      c.x += cos(angle) * 10;
      c.y += sin(angle) * 10;
    }
  }
}
