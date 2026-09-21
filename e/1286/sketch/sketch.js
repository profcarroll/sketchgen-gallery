let balloons = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Create several hot air balloons with unique colors and positions
  for (let i = 0; i < 15; i++) {
    balloons.push({
      x: random(width),
      y: random(height),
      size: random(40, 80),
      color: color(random(100, 255), random(100, 255), random(100, 255)),
      speedX: random(-0.5, 0.5),
      speedY: random(-0.3, 0.3),
      glowSize: random(60, 100)
    });
  }
}

function draw() {
  // Soft sky gradient background
  background(135, 206, 235);
  
  // Draw each balloon with a soft glow effect
  for (let i = 0; i < balloons.length; i++) {
    let b = balloons[i];
    
    // Update position slowly
    b.x += b.speedX;
    b.y += b.speedY;
    
    // Wrap around edges
    if (b.x > width + b.size) b.x = -b.size;
    if (b.x < -b.size) b.x = width + b.size;
    if (b.y > height + b.size) b.y = -b.size;
    if (b.y < -b.size) b.y = height + b.size;
    
    // Glow effect using multiple transparent ellipses
    noStroke();
    for (let j = 0; j < 5; j++) {
      fill(red(b.color), green(b.color), blue(b.color), 30);
      ellipse(b.x, b.y, b.glowSize + j * 10);
    }
    
    // Balloon body
    fill(b.color);
    ellipse(b.x, b.y, b.size, b.size * 1.2);
    
    // Balloon basket
    fill(50, 30, 0);
    rect(b.x - 10, b.y + b.size/2, 20, 15, 3);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
