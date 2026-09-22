let fibers = [];
let knots = [];
let numFibers = 800;
let numKnots = 20;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();
  
  // Create flowing organic fibers
  for (let i = 0; i < numFibers; i++) {
    let fiber = {
      points: [],
      color: color(random(100, 255), random(50, 200), random(100, 255), 180),
      thickness: random(1, 3)
    };
    
    // Start fiber at a random position
    let startX = random(width);
    let startY = random(height);
    let prevX = startX;
    let prevY = startY;
    
    // Create a winding path
    for (let j = 0; j < 50; j++) {
      let angle = atan2(prevY - height/2, prevX - width/2) + random(-0.3, 0.3);
      let stepSize = random(5, 15);
      let x = prevX + cos(angle) * stepSize;
      let y = prevY + sin(angle) * stepSize;
      
      // Keep within canvas bounds
      x = constrain(x, 0, width);
      y = constrain(y, 0, height);
      
      fiber.points.push({x, y});
      prevX = x;
      prevY = y;
    }
    
    fibers.push(fiber);
  }
  
  // Create geometric knots
  for (let i = 0; i < numKnots; i++) {
    let knot = {
      x: random(width),
      y: random(height),
      size: random(20, 60),
      color: color(random(200, 255), random(100, 150), random(50, 100), 220),
      shape: random(['square', 'triangle', 'circle'])
    };
    knots.push(knot);
  }
}

function draw() {
  background(10, 10, 30);
  
  // Draw fibers
  for (let fiber of fibers) {
    stroke(fiber.color);
    strokeWeight(fiber.thickness);
    noFill();
    
    beginShape();
    for (let point of fiber.points) {
      curveVertex(point.x, point.y);
    }
    endShape();
  }
  
  // Draw knots
  for (let knot of knots) {
    fill(knot.color);
    noStroke();
    
    switch (knot.shape) {
      case 'square':
        rectMode(CENTER);
        rect(knot.x, knot.y, knot.size, knot.size);
        break;
      case 'triangle':
        triangle(
          knot.x, knot.y - knot.size/2,
          knot.x - knot.size/2, knot.y + knot.size/2,
          knot.x + knot.size/2, knot.y + knot.size/2
        );
        break;
      case 'circle':
        ellipse(knot.x, knot.y, knot.size, knot.size);
        break;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
