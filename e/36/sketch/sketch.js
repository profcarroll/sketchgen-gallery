let circles = [];
let stars = [];
let ripple = null;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create initial circles
  for (let i = 0; i < 200; i++) {
    circles.push({
      x: random(width),
      y: random(height, height + 200),
      size: random(50, 300),
      speed: random(0.1, 0.3),
      hue: random(200, 260),
      alpha: random(0.05, 0.15)
    });
  }
  
  // Create stars
  for (let i = 0; i < 500; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(0.5, 2),
      brightness: random(50, 100)
    });
  }
}

function draw() {
  background(20, 10, 10); // Dark background
  
  // Draw stars
  for (let star of stars) {
    fill(360, 0, star.brightness, 1);
    noStroke();
    ellipse(star.x, star.y, star.size);
  }
  
  // Update and draw circles
  for (let circle of circles) {
    circle.y -= circle.speed;
    
    // Reset circle when it goes off screen
    if (circle.y < -circle.size) {
      circle.y = height + circle.size;
      circle.x = random(width);
    }
    
    // Draw circle
    fill(circle.hue, 50, 80, circle.alpha);
    noStroke();
    ellipse(circle.x, circle.y, circle.size);
  }
  
  // Handle ripple effect
  if (ripple) {
    ripple.radius += 10;
    if (ripple.radius > 200) {
      ripple = null;
    } else {
      // Apply ripple force to circles
      for (let circle of circles) {
        let d = dist(circle.x, circle.y, ripple.x, ripple.y);
        if (d < ripple.radius + circle.size/2) {
          let angle = atan2(circle.y - ripple.y, circle.x - ripple.x);
          let force = map(d, 0, ripple.radius, 10, 0);
          circle.x += cos(angle) * force * 0.1;
          circle.y += sin(angle) * force * 0.1;
        }
      }
    }
  }
}

function mousePressed() {
  // Create ripple effect at click position
  ripple = {
    x: mouseX,
    y: mouseY,
    radius: 0
  };
}
