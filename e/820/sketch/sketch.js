let planes = [];
const numPlanes = 150;
const fieldSize = 800;
const speed = 0.002;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize planes with random positions and properties
  for (let i = 0; i < numPlanes; i++) {
    planes.push({
      x: random(-fieldSize/2, fieldSize/2),
      y: random(-fieldSize/2, fieldSize/2),
      z: random(-fieldSize/2, fieldSize/2),
      size: random(50, 200),
      speedX: random(-0.5, 0.5) * speed,
      speedY: random(-0.5, 0.5) * speed,
      speedZ: random(-0.5, 0.5) * speed,
      hue: random(360),
      alpha: random(0.1, 0.3)
    });
  }
}

function draw() {
  background(0, 0, 0, 0.05); // Semi-transparent background for trail effect
  
  // Draw all planes
  for (let i = 0; i < planes.length; i++) {
    let p = planes[i];
    
    // Update position
    p.x += p.speedX;
    p.y += p.speedY;
    p.z += p.speedZ;
    
    // Wrap around edges
    if (p.x > fieldSize/2) p.x = -fieldSize/2;
    if (p.x < -fieldSize/2) p.x = fieldSize/2;
    if (p.y > fieldSize/2) p.y = -fieldSize/2;
    if (p.y < -fieldSize/2) p.y = fieldSize/2;
    if (p.z > fieldSize/2) p.z = -fieldSize/2;
    if (p.z < -fieldSize/2) p.z = fieldSize/2;
    
    // Change hue over time for color shift
    p.hue = (p.hue + 0.1) % 360;
    
    // Draw the plane using ellipse with dynamic size and opacity
    noStroke();
    fill(p.hue, 80, 90, p.alpha);
    
    push();
    translate(width/2 + p.x, height/2 + p.y, p.z);
    scale(p.size / 100); // Scale the size
    ellipse(0, 0, 100, 100); // Draw a circular plane
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
