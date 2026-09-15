let planes = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create a series of large geometric planes
  for (let i = 0; i < 20; i++) {
    planes.push({
      x: random(-500, 500),
      y: random(-500, 500),
      z: random(-1000, 1000),
      size: random(300, 600),
      rotationX: random(TWO_PI),
      rotationY: random(TWO_PI),
      speed: random(0.001, 0.005)
    });
  }
}

function draw() {
  background(0);
  
  // Set up lighting
  pointLight(100, 255, 100, 0, 0, 1000); // Emerald green light source
  ambientLight(30, 100, 30);
  
  time += 0.01;
  
  // Draw the planes with dynamic movement and glowing effect
  for (let i = 0; i < planes.length; i++) {
    push();
    
    let p = planes[i];
    
    // Animate each plane
    p.rotationX += p.speed * sin(time);
    p.rotationY += p.speed * cos(time);
    
    translate(p.x, p.y, p.z);
    rotateX(p.rotationX);
    rotateY(p.rotationY);
    
    // Create a tessellated grid pattern on each plane
    let gridSize = 20;
    let gridCount = p.size / gridSize;
    
    stroke(100, 80, 60, 0.7); // Subtle reflective color
    noFill();
    
    // Draw lines for the grid pattern
    beginShape(LINES);
    for (let x = -p.size/2; x <= p.size/2; x += gridSize) {
      vertex(x, -p.size/2, 0);
      vertex(x, p.size/2, 0);
    }
    for (let y = -p.size/2; y <= p.size/2; y += gridSize) {
      vertex(-p.size/2, y, 0);
      vertex(p.size/2, y, 0);
    }
    endShape();
    
    // Add a glowing emerald green seam
    stroke(100, 100, 80, 0.6); // Emerald green
    strokeWeight(4);
    beginShape(LINES);
    vertex(-p.size/2, 0, 0);
    vertex(p.size/2, 0, 0);
    endShape();
    
    pop();
  }
  
  // Add some floating crystalline particles for depth and detail
  noStroke();
  fill(100, 100, 80, 0.3); // Emerald green with transparency
  
  for (let i = 0; i < 200; i++) {
    let x = sin(time * 0.5 + i) * 300;
    let y = cos(time * 0.3 + i) * 200;
    let z = sin(time * 0.7 + i) * 400;
    
    push();
    translate(x, y, z);
    sphere(2);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
