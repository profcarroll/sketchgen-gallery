let fibers = [];
let knots = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  
  // Create textile fibers
  for (let i = 0; i < 500; i++) {
    fibers.push({
      pos: createVector(random(-width, width), random(-height, height), random(-100, 100)),
      vel: p5.Vector.random3D().mult(random(0.5, 2)),
      size: random(2, 8),
      color: color(random(100, 255), random(100, 255), random(100, 255), 150),
      sway: random(TWO_PI)
    });
  }
  
  // Create geometric knots
  for (let i = 0; i < 20; i++) {
    knots.push({
      pos: createVector(random(-width/2, width/2), random(-height/2, height/2), random(-100, 100)),
      size: random(10, 30),
      rotation: random(TWO_PI),
      color: color(random(50, 150), random(50, 150), random(200, 255), 200)
    });
  }
}

function draw() {
  background(10, 10, 30);
  
  time += 0.01;
  
  // Draw fibers
  beginShape(POINTS);
  for (let fiber of fibers) {
    fiber.pos.add(fiber.vel);
    
    // Add some organic movement
    fiber.pos.x += sin(time + fiber.sway) * 0.5;
    fiber.pos.y += cos(time + fiber.sway) * 0.5;
    
    // Boundary check
    if (fiber.pos.mag() > width * 1.5) {
      fiber.pos = createVector(random(-width, width), random(-height, height), random(-100, 100));
      fiber.sway = random(TWO_PI);
    }
    
    fill(fiber.color);
    vertex(fiber.pos.x, fiber.pos.y, fiber.pos.z);
  }
  endShape();
  
  // Draw knots
  for (let knot of knots) {
    push();
    translate(knot.pos.x, knot.pos.y, knot.pos.z);
    rotateX(time * 0.2 + knot.rotation);
    rotateY(time * 0.3 + knot.rotation);
    rotateZ(time * 0.1 + knot.rotation);
    
    fill(knot.color);
    box(knot.size);
    pop();
  }
}
