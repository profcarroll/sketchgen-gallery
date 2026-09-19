let fibers = [];
let knots = [];

function setup() {
  createCanvas(800, 600);
  noLoop();
  
  // Create fibers
  for (let i = 0; i < 200; i++) {
    let fiber = {
      points: [],
      color: color(
        random(50, 150),
        random(80, 200),
        random(100, 255),
        random(150, 255)
      )
    };
    
    let start = createVector(random(width), random(height));
    let end = createVector(random(width), random(height));
    
    // Create a curved path
    let midPoint = p5.Vector.lerp(start, end, 0.5);
    midPoint.add(
      random(-100, 100),
      random(-100, 100)
    );
    
    for (let j = 0; j < 20; j++) {
      let t = map(j, 0, 19, 0, 1);
      let point = p5.Vector.lerp(start, end, t);
      point.add(
        noise(point.x * 0.01, point.y * 0.01) * 30,
        noise(point.x * 0.02, point.y * 0.02) * 30
      );
      fiber.points.push(point);
    }
    
    fibers.push(fiber);
  }
  
  // Create knots (geometric intersections)
  for (let i = 0; i < 50; i++) {
    let knot = {
      x: random(width),
      y: random(height),
      size: random(20, 60),
      color: color(
        random(100, 255),
        random(50, 150),
        random(80, 200),
        random(100, 200)
      )
    };
    knots.push(knot);
  }
}

function draw() {
  background(20);
  
  // Draw fibers
  for (let fiber of fibers) {
    stroke(fiber.color);
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
    
    push();
    translate(knot.x, knot.y);
    rotate(frameCount * 0.01);
    
    // Draw geometric knot shape
    for (let i = 0; i < 8; i++) {
      let angle = TWO_PI / 8 * i;
      let x = cos(angle) * knot.size;
      let y = sin(angle) * knot.size;
      
      ellipse(x, y, knot.size/3, knot.size/3);
    }
    
    pop();
  }
}
