let shapes = [];
let colors = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Initialize with some shapes and colors
  for (let i = 0; i < 20; i++) {
    shapes.push({
      x: random(width),
      y: random(height),
      size: random(20, 100),
      angle: random(TWO_PI),
      speed: random(0.01, 0.03),
      pulse: random(0.5, 2)
    });
    colors.push({
      r: random(100, 255),
      g: random(100, 255),
      b: random(100, 255),
      a: random(150, 255)
    });
  }
}

function draw() {
  background(10);
  
  // Update and draw each shape
  for (let i = 0; i < shapes.length; i++) {
    let s = shapes[i];
    let c = colors[i];
    
    // Update position and size based on time
    s.angle += s.speed;
    let pulse = sin(frameCount * 0.02 * s.pulse) * 0.5 + 0.5;
    let newSize = s.size * (1 + pulse * 0.5);
    
    // Draw a pulsing shape
    push();
    translate(s.x, s.y);
    rotate(s.angle);
    
    fill(c.r, c.g, c.b, c.a);
    noStroke();
    
    // Alternate between different shapes
    if (i % 3 === 0) {
      ellipse(0, 0, newSize, newSize);
    } else if (i % 3 === 1) {
      rectMode(CENTER);
      rect(0, 0, newSize, newSize);
    } else {
      triangle(0, -newSize/2, -newSize/2, newSize/2, newSize/2, newSize/2);
    }
    
    pop();
    
    // Move shape slightly
    s.x += sin(s.angle) * 0.5;
    s.y += cos(s.angle) * 0.5;
    
    // Wrap around edges
    if (s.x > width + 50) s.x = -50;
    if (s.x < -50) s.x = width + 50;
    if (s.y > height + 50) s.y = -50;
    if (s.y < -50) s.y = height + 50;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
