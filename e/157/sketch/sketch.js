let paths = [];
let focalPoint = { x: 0, y: 0 };
let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Initialize with some paths
  for (let i = 0; i < 50; i++) {
    paths.push({
      x: random(width),
      y: random(height),
      size: random(20, 100),
      speed: random(0.001, 0.005),
      angle: random(TWO_PI),
      color: color(random(100, 255), random(100, 255), random(100, 255), 100)
    });
  }
  focalPoint.x = width / 2;
  focalPoint.y = height / 2;
}

function draw() {
  background(10, 10, 20);
  
  // Update and display paths
  for (let i = 0; i < paths.length; i++) {
    let p = paths[i];
    
    // Animate path
    p.x += cos(p.angle) * p.speed * 100;
    p.y += sin(p.angle) * p.speed * 100;
    
    // Bounce off edges
    if (p.x < 0 || p.x > width) p.angle = PI - p.angle;
    if (p.y < 0 || p.y > height) p.angle = -p.angle;
    
    // Draw path as a geometric shape
    push();
    translate(p.x, p.y);
    rotate(frameCount * p.speed);
    fill(p.color);
    noStroke();
    ellipse(0, 0, p.size, p.size);
    pop();
    
    // Adjust based on focal point
    let dx = p.x - focalPoint.x;
    let dy = p.y - focalPoint.y;
    let distance = sqrt(dx * dx + dy * dy);
    
    if (distance < 200) {
      let force = map(distance, 0, 200, 1, 0.1);
      p.angle += (dx * force) * 0.001;
    }
  }
  
  // Draw focal point
  fill(255, 200);
  noStroke();
  ellipse(focalPoint.x, focalPoint.y, 20, 20);
}

function mousePressed() {
  // Reset paths on click
  for (let i = 0; i < paths.length; i++) {
    paths[i].angle += random(-0.5, 0.5);
  }
  
  // Move focal point to mouse position
  focalPoint.x = mouseX;
  focalPoint.y = mouseY;
}

function mouseDragged() {
  isDragging = true;
  focalPoint.x = mouseX;
  focalPoint.y = mouseY;
}

function mouseReleased() {
  isDragging = false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
