let circles = [];
const circleCount = 300;
const rippleStrength = 20;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize circles with random properties
  for (let i = 0; i < circleCount; i++) {
    circles.push({
      x: random(width),
      y: random(height),
      size: random(20, 80),
      speed: random(0.5, 2),
      hue: random(180, 240), // Blue range
      saturation: random(40, 80),
      brightness: random(30, 70),
      alpha: random(0.05, 0.2),
      angle: random(TWO_PI)
    });
  }
}

function draw() {
  background(0, 0, 10); // Dark blue background
  
  // Update and display circles
  for (let i = 0; i < circles.length; i++) {
    let c = circles[i];
    
    // Move circle upward
    c.y -= c.speed;
    
    // Reset circle if it goes off screen
    if (c.y < -c.size) {
      c.y = height + c.size;
      c.x = random(width);
    }
    
    // Apply subtle horizontal drift
    c.x += sin(c.angle) * 0.2;
    c.angle += 0.01;
    
    // Draw circle with transparency
    noStroke();
    fill(c.hue, c.saturation, c.brightness, c.alpha);
    ellipse(c.x, c.y, c.size);
  }
}

function mousePressed() {
  // Create ripple effect at mouse position
  for (let i = 0; i < circles.length; i++) {
    let c = circles[i];
    let d = dist(mouseX, mouseY, c.x, c.y);
    
    if (d < 150) {
      // Push circle outward
      let force = map(d, 0, 150, rippleStrength, 0);
      c.x += (c.x - mouseX) * force * 0.01;
      c.y += (c.y - mouseY) * force * 0.01;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
