let planes = [];
const numPlanes = 150;
const glowStrength = 200;
const connectionDistance = 150;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize planes with random positions, sizes, and colors
  for (let i = 0; i < numPlanes; i++) {
    planes.push({
      x: random(width),
      y: random(height),
      z: random(-50, 50),
      size: random(30, 100),
      color: color(random(360), 80, 90, 0.8),
      speedX: random(-0.5, 0.5),
      speedY: random(-0.5, 0.5),
      speedZ: random(-0.2, 0.2)
    });
  }
}

function draw() {
  background(0);
  
  // Update and draw planes
  for (let i = 0; i < planes.length; i++) {
    let p = planes[i];
    
    // Move the plane
    p.x += p.speedX;
    p.y += p.speedY;
    p.z += p.speedZ;
    
    // Wrap around edges
    if (p.x > width + 50) p.x = -50;
    if (p.x < -50) p.x = width + 50;
    if (p.y > height + 50) p.y = -50;
    if (p.y < -50) p.y = height + 50;
    
    // Draw the glowing plane
    drawGlowingPlane(p);
  }
  
  // Draw connections between nearby planes
  for (let i = 0; i < planes.length; i++) {
    for (let j = i + 1; j < planes.length; j++) {
      let p1 = planes[i];
      let p2 = planes[j];
      
      let d = dist(p1.x, p1.y, p2.x, p2.y);
      
      if (d < connectionDistance) {
        // Calculate line width based on distance
        let lineWidth = map(d, 0, connectionDistance, 3, 0.5);
        
        // Draw a connecting line with increasing contrast
        strokeWeight(lineWidth);
        let alpha = map(d, 0, connectionDistance, 0.8, 0.1);
        stroke(hue(p1.color), saturation(p1.color), brightness(p1.color), alpha);
        line(p1.x, p1.y, p2.x, p2.y);
      }
    }
  }
}

function drawGlowingPlane(p) {
  // Draw the glow
  noStroke();
  fill(p.color);
  
  // Use multiple layers to create a glowing effect
  for (let i = 0; i < 5; i++) {
    let alpha = map(i, 0, 4, 0.3, 0.02);
    fill(hue(p.color), saturation(p.color), brightness(p.color), alpha);
    
    push();
    translate(p.x, p.y);
    rotate(p.z * 0.01);
    ellipse(0, 0, p.size + i * 5);
    pop();
  }
  
  // Draw the main plane
  fill(p.color);
  push();
  translate(p.x, p.y);
  rotate(p.z * 0.01);
  ellipse(0, 0, p.size);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
