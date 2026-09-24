let shapes = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Create honeycomb-like patterns with irregular polygons
  for (let i = 0; i < 150; i++) {
    const x = random(width);
    const y = random(height);
    const size = random(30, 100);
    const sides = floor(random(5, 9));
    shapes.push({
      x,
      y,
      size,
      sides,
      angle: random(TWO_PI),
      speed: random(0.002, 0.008),
      color: color(random(100, 255), random(30, 100), random(150, 255), 200)
    });
  }
}

function draw() {
  background(10, 15, 30);
  
  time += 0.01;
  
  for (let shape of shapes) {
    // Animate the shape
    shape.angle += shape.speed;
    
    // Create a breathing effect with size
    const pulse = sin(time * 0.7 + shape.x * 0.01) * 0.5 + 0.5;
    const currentSize = shape.size * (0.8 + pulse * 0.4);
    
    // Use shifting color gradient based on position and time
    const hueShift = (time * 20 + shape.x * 0.01 + shape.y * 0.01) % 360;
    fill(hueShift, 80, 70, 180);
    
    push();
    translate(shape.x, shape.y);
    rotate(shape.angle);
    
    // Draw irregular polygon
    beginShape();
    for (let i = 0; i < shape.sides; i++) {
      const angle = map(i, 0, shape.sides, 0, TWO_PI);
      const radius = currentSize * (0.8 + noise(time + i) * 0.4);
      const x = cos(angle) * radius;
      const y = sin(angle) * radius;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    pop();
  }
  
  // Add subtle ripple effect
  for (let i = 0; i < 50; i++) {
    const x = (time * 20 + i * 30) % width;
    const y = (time * 10 + i * 20) % height;
    const size = sin(time + i) * 20 + 40;
    const alpha = map(size, 20, 60, 30, 100);
    
    fill(255, 100, 100, alpha);
    ellipse(x, y, size, size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
