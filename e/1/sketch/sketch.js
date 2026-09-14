let circles = [];
const circleCount = 150;
const rippleRadius = 100;

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  for (let i = 0; i < circleCount; i++) {
    circles.push({
      x: random(width),
      y: random(height),
      size: random(20, 80),
      speed: random(0.5, 2),
      hue: 200 + random(20), // Cool blue range
      alpha: random(0.1, 0.3)
    });
  }
}

function draw() {
  background(0, 0, 10, 1); // Dark background with slight transparency for trail effect
  
  for (let i = 0; i < circles.length; i++) {
    let c = circles[i];
    
    // Move circle upward
    c.y -= c.speed;
    
    // Reset circle when it goes off screen
    if (c.y < -c.size) {
      c.y = height + c.size;
      c.x = random(width);
    }
    
    fill(c.hue, 70, 90, c.alpha);
    ellipse(c.x, c.y, c.size);
  }
}

function mousePressed() {
  // Create ripple effect
  let mouseX = pmouseX;
  let mouseY = pmouseY;
  
  for (let i = 0; i < circles.length; i++) {
    let c = circles[i];
    let d = dist(mouseX, mouseY, c.x, c.y);
    
    if (d < rippleRadius) {
      // Push circle away from mouse
      let angle = atan2(c.y - mouseY, c.x - mouseX);
      let force = map(d, 0, rippleRadius, 5, 0);
      c.x += cos(angle) * force;
      c.y += sin(angle) * force;
    }
  }
}
