let fibers = [];
let knots = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Initialize fibers
  for (let i = 0; i < 300; i++) {
    fibers.push({
      x: random(width),
      y: random(height),
      size: random(50, 200),
      angle: random(TWO_PI),
      speed: random(0.001, 0.005),
      color: color(random(100, 255), random(100, 255), random(200, 255), 150)
    });
  }
  
  // Initialize knots
  for (let i = 0; i < 50; i++) {
    knots.push({
      x: random(width),
      y: random(height),
      size: random(10, 30),
      angle: random(TWO_PI),
      speed: random(0.002, 0.008),
      color: color(random(200, 255), random(100, 150), random(50, 100), 200)
    });
  }
}

function draw() {
  background(10, 10, 30);
  
  time += 0.01;
  
  // Draw fibers
  for (let fiber of fibers) {
    fiber.angle += fiber.speed;
    fiber.x += cos(fiber.angle) * 0.5;
    fiber.y += sin(fiber.angle) * 0.5;
    
    // Reset if out of bounds
    if (fiber.x < -100 || fiber.x > width + 100 || fiber.y < -100 || fiber.y > height + 100) {
      fiber.x = random(width);
      fiber.y = random(height);
      fiber.angle = random(TWO_PI);
    }
    
    fill(fiber.color);
    noStroke();
    ellipse(fiber.x, fiber.y, fiber.size, fiber.size * 0.6);
  }
  
  // Draw knots
  for (let knot of knots) {
    knot.angle += knot.speed;
    knot.x += cos(knot.angle) * 0.3;
    knot.y += sin(knot.angle) * 0.3;
    
    // Reset if out of bounds
    if (knot.x < -50 || knot.x > width + 50 || knot.y < -50 || knot.y > height + 50) {
      knot.x = random(width);
      knot.y = random(height);
      knot.angle = random(TWO_PI);
    }
    
    fill(knot.color);
    stroke(255, 100);
    strokeWeight(1);
    rectMode(CENTER);
    rect(knot.x, knot.y, knot.size, knot.size, 5);
  }
  
  // Add some interwoven lines
  stroke(255, 30);
  strokeWeight(0.5);
  beginShape();
  for (let i = 0; i < 100; i++) {
    let x = sin(time + i * 0.1) * width * 0.4 + width * 0.5;
    let y = cos(time * 0.5 + i * 0.1) * height * 0.3 + height * 0.5;
    vertex(x, y);
  }
  endShape();
}
