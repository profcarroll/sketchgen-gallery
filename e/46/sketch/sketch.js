let circles = [];
let stars = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Create fluid circles
  for (let i = 0; i < 150; i++) {
    circles.push({
      x: random(width),
      y: random(height),
      size: random(20, 100),
      speedX: random(-0.1, 0.1),
      speedY: random(-0.1, 0.1),
      hue: random(200, 300), // Blue to purple range
      alpha: random(20, 60)
    });
  }
  
  // Create stars
  for (let i = 0; i < 200; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      pulseSpeed: random(0.01, 0.03),
      pulsePhase: random(TWO_PI)
    });
  }
}

function draw() {
  background(10, 10, 25);
  
  // Update and display circles
  for (let circle of circles) {
    circle.x += circle.speedX;
    circle.y += circle.speedY;
    
    // Wrap around edges
    if (circle.x < -circle.size) circle.x = width + circle.size;
    if (circle.x > width + circle.size) circle.x = -circle.size;
    if (circle.y < -circle.size) circle.y = height + circle.size;
    if (circle.y > height + circle.size) circle.y = -circle.size;
    
    // Draw circle with smooth color transition
    fill(circle.hue, 80, 70, circle.alpha);
    ellipse(circle.x, circle.y, circle.size);
    
    // Shift hue over time for fluid effect
    circle.hue = (circle.hue + 0.1) % 360;
  }
  
  // Update and display stars
  for (let star of stars) {
    let pulse = sin(frameCount * star.pulseSpeed + star.pulsePhase);
    let size = star.size + pulse * 1.5;
    
    fill(255, 255, 220, 180 + pulse * 75); // Bright yellow-white with pulsing
    ellipse(star.x, star.y, size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
