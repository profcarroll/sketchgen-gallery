let lines = [];
let points = [];
const maxPoints = 2000;
const maxLines = 5000;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize points
  for (let i = 0; i < maxPoints; i++) {
    points.push({
      x: random(width),
      y: random(height),
      age: random(100),
      hue: random(120, 180), // Blue-green hues
      size: random(0.5, 3)
    });
  }
  
  // Initialize lines
  for (let i = 0; i < maxLines; i++) {
    lines.push({
      x1: random(width),
      y1: random(height),
      x2: random(width),
      y2: random(height),
      hue: random(120, 180),
      alpha: random(0.1, 0.3),
      thickness: random(0.5, 1.5)
    });
  }
}

function draw() {
  background(0);
  
  time += 0.005;
  
  // Draw lines
  strokeWeight(1);
  for (let i = 0; i < lines.length; i++) {
    const lineSeg = lines[i];
    stroke(lineSeg.hue, 80, 90, lineSeg.alpha);
    line(lineSeg.x1, lineSeg.y1, lineSeg.x2, lineSeg.y2);
  }
  
  // Draw points
  noStroke();
  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    fill(point.hue, 80, 90, 0.5);
    ellipse(point.x, point.y, point.size);
  }
  
  // Update points and lines
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    p.age += 0.5;
    
    // Slowly change position to simulate growth
    p.x += sin(time + p.age * 0.01) * 0.2;
    p.y += cos(time + p.age * 0.01) * 0.2;
    
    // Keep within bounds
    if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
      p.x = random(width);
      p.y = random(height);
      p.age = 0;
    }
  }
  
  // Add new lines periodically
  if (frameCount % 30 === 0) {
    for (let i = 0; i < 50; i++) {
      const idx1 = floor(random(points.length));
      const idx2 = floor(random(points.length));
      
      if (idx1 !== idx2) {
        lines.push({
          x1: points[idx1].x,
          y1: points[idx1].y,
          x2: points[idx2].x,
          y2: points[idx2].y,
          hue: random(120, 180),
          alpha: random(0.1, 0.3),
          thickness: random(0.5, 1.5)
        });
        
        // Keep lines under max
        if (lines.length > maxLines) {
          lines.shift();
        }
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
