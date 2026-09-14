let lines = [];
let nodes = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Initialize lines with random properties
  for (let i = 0; i < 20; i++) {
    lines.push({
      x: random(width),
      y: random(height),
      size: random(50, 300),
      speed: random(0.001, 0.005),
      angle: random(TWO_PI),
      color: color(random(100, 255), random(100, 255), random(100, 255), 100)
    });
  }
  
  // Initialize nodes
  for (let i = 0; i < 100; i++) {
    nodes.push({
      x: random(width),
      y: random(height),
      size: random(3, 15),
      color: random() > 0.5 ? color(255, 0, 0) : color(0, 255, 0),
      irregularity: random(0.8, 1.2)
    });
  }
}

function draw() {
  background(10);
  
  // Update and display lines
  for (let line of lines) {
    line.x += cos(line.angle) * line.speed * 100;
    line.y += sin(line.angle) * line.speed * 100;
    
    // Bounce off edges
    if (line.x < 0 || line.x > width) line.angle = PI - line.angle;
    if (line.y < 0 || line.y > height) line.angle = -line.angle;
    
    fill(line.color);
    ellipse(line.x, line.y, line.size * line.irregularity, line.size);
  }
  
  // Update and display nodes
  for (let node of nodes) {
    node.x += random(-1, 1);
    node.y += random(-1, 1);
    
    // Wrap around edges
    if (node.x < 0) node.x = width;
    if (node.x > width) node.x = 0;
    if (node.y < 0) node.y = height;
    if (node.y > height) node.y = 0;
    
    fill(node.color);
    ellipse(node.x, node.y, node.size * node.irregularity, node.size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
