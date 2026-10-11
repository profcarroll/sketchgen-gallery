let layers = [];
let riverLines = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Create geological layers
  for (let i = 0; i < 20; i++) {
    let y = map(i, 0, 19, height * 0.3, height * 0.8);
    let thickness = random(5, 15);
    layers.push({
      y: y,
      thickness: thickness,
      color: color(random(80, 120), random(60, 100), random(40, 80))
    });
  }
  
  // Create river network
  for (let i = 0; i < 500; i++) {
    riverLines.push({
      points: [],
      length: random(30, 80),
      speed: random(0.001, 0.005)
    });
  }
  
  // Initialize river points
  for (let line of riverLines) {
    let startX = random(width * 0.2, width * 0.8);
    let startY = random(height * 0.4, height * 0.7);
    line.points.push(createVector(startX, startY));
    
    // Add some initial segments
    for (let j = 1; j < line.length; j++) {
      let prev = line.points[j-1];
      let newPoint = createVector(
        prev.x + random(-3, 3),
        prev.y + random(-2, 2)
      );
      line.points.push(newPoint);
    }
  }
}

function draw() {
  background(20);
  
  // Draw geological layers
  for (let layer of layers) {
    fill(layer.color);
    noStroke();
    rect(0, layer.y, width, layer.thickness);
    
    // Add subtle texture lines
    stroke(0, 30);
    strokeWeight(0.5);
    for (let i = 0; i < 10; i++) {
      let x1 = random(width);
      let x2 = random(width);
      let y = layer.y + random(layer.thickness);
      line(x1, y, x2, y);
    }
  }
  
  // Draw river network
  stroke(150, 180);
  strokeWeight(0.8);
  noFill();
  
  time += 0.01;
  
  for (let line of riverLines) {
    // Update points with subtle movement
    for (let i = 0; i < line.points.length; i++) {
      let p = line.points[i];
      if (i > 0 && i < line.points.length - 1) {
        // Add gentle flow effect
        p.x += sin(time + i * 0.1) * 0.3;
        p.y += cos(time + i * 0.1) * 0.2;
      }
    }
    
    beginShape();
    for (let p of line.points) {
      vertex(p.x, p.y);
    }
    endShape();
  }
  
  // Add subtle glow effect
  drawingContext.shadowColor = color(150, 180, 255, 30);
  drawingContext.shadowBlur = 3;
  
  for (let line of riverLines) {
    beginShape();
    for (let p of line.points) {
      vertex(p.x, p.y);
    }
    endShape();
  }
  
  drawingContext.shadowBlur = 0;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
