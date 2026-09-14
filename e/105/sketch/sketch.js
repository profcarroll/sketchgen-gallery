let lines = [];
let nodes = [];
let zoomLevel = 1;
let offsetX = 0;
let isDragging = false;
let lastX = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize lines and nodes
  for (let i = 0; i < 200; i++) {
    lines.push({
      x: random(width),
      y: random(height),
      vx: random(-2, 2),
      vy: random(-2, 2),
      hue: random(120, 180), // Green to Red range
      size: random(5, 20)
    });
    
    nodes.push({
      x: random(width),
      y: random(height),
      vx: random(-1, 1),
      vy: random(-1, 1),
      hue: random(120, 180),
      size: random(3, 8)
    });
  }
}

function draw() {
  background(0, 0, 10);
  
  // Simulate market fluctuations with dynamic shapes
  for (let i = 0; i < lines.length; i++) {
    let l = lines[i];
    
    // Update position
    l.x += l.vx * zoomLevel;
    l.y += l.vy * zoomLevel;
    
    // Bounce off edges
    if (l.x < 0 || l.x > width) l.vx *= -1;
    if (l.y < 0 || l.y > height) l.vy *= -1;
    
    // Draw line
    stroke(l.hue, 80, 90, 0.7);
    strokeWeight(l.size * zoomLevel / 2);
    point(l.x, l.y);
  }
  
  // Connect nodes with lines to simulate market trends
  for (let i = 0; i < nodes.length; i++) {
    let n = nodes[i];
    
    // Update position
    n.x += n.vx * zoomLevel;
    n.y += n.vy * zoomLevel;
    
    // Bounce off edges
    if (n.x < 0 || n.x > width) n.vx *= -1;
    if (n.y < 0 || n.y > height) n.vy *= -1;
    
    // Draw node
    stroke(n.hue, 80, 90, 0.8);
    strokeWeight(n.size * zoomLevel / 2);
    point(n.x, n.y);
    
    // Connect nearby nodes
    for (let j = i + 1; j < nodes.length; j++) {
      let other = nodes[j];
      let d = dist(n.x, n.y, other.x, other.y);
      
      if (d < 100 * zoomLevel) {
        stroke(n.hue, 80, 90, 0.2 * zoomLevel);
        strokeWeight(0.5 * zoomLevel);
        line(n.x, n.y, other.x, other.y);
      }
    }
  }
  
  // Pulsing effect
  let pulse = sin(frameCount * 0.02) * 0.1 + 0.9;
  filter(BLUR, pulse * 2);
}

function mousePressed() {
  isDragging = true;
  lastX = mouseX;
}

function mouseReleased() {
  isDragging = false;
}

function mouseDragged() {
  if (isDragging) {
    let delta = mouseX - lastX;
    zoomLevel += delta * 0.005;
    zoomLevel = constrain(zoomLevel, 0.5, 3);
    lastX = mouseX;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
