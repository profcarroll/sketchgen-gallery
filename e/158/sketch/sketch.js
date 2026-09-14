let shapes = [];
let scanlineOffset = 0;

function setup() {
  createCanvas(800, 600);
  noStroke();
  
  // Initialize some shapes with random properties
  for (let i = 0; i < 20; i++) {
    shapes.push({
      x: random(width),
      y: random(height),
      size: random(50, 200),
      angle: random(TWO_PI),
      speed: random(0.01, 0.05),
      color: color(random(100, 255), random(100, 255), random(100, 255), 200),
      type: floor(random(3)) // 0: rect, 1: ellipse, 2: triangle
    });
  }
}

function draw() {
  background(0);
  
  // Draw scanline effect
  scanlineOffset += 2;
  for (let y = 0; y < height; y += 4) {
    if ((y + scanlineOffset) % 16 < 8) {
      stroke(255, 30);
      line(0, y, width, y);
    }
  }
  
  // Update and draw shapes
  for (let shape of shapes) {
    shape.x += sin(frameCount * shape.speed) * 0.5;
    shape.y += cos(frameCount * shape.speed) * 0.5;
    shape.angle += 0.01;
    
    push();
    translate(shape.x, shape.y);
    rotate(shape.angle);
    
    fill(shape.color);
    
    if (shape.type === 0) {
      rectMode(CENTER);
      rect(0, 0, shape.size, shape.size * 0.5);
    } else if (shape.type === 1) {
      ellipse(0, 0, shape.size, shape.size * 0.5);
    } else {
      triangle(0, -shape.size/2, -shape.size/2, shape.size/2, shape.size/2, shape.size/2);
    }
    
    pop();
  }
  
  // Occasionally change colors for more dynamic effect
  if (frameCount % 100 === 0) {
    for (let shape of shapes) {
      shape.color = color(random(100, 255), random(100, 255), random(100, 255), 200);
    }
  }
}
