let planes = [];
let rotationSpeed = 0.002;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create multiple interconnected planes
  for (let i = 0; i < 8; i++) {
    let plane = {
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-200, 200),
      size: random(100, 300),
      rotationX: random(TWO_PI),
      rotationY: random(TWO_PI),
      rotationZ: random(TWO_PI),
      hue: random(360)
    };
    planes.push(plane);
  }
}

function draw() {
  background(0, 0, 0, 1);
  
  // Center the scene
  translate(0, 0, -500);
  
  for (let i = 0; i < planes.length; i++) {
    let p = planes[i];
    
    push();
    
    // Apply rotations
    rotateX(p.rotationX);
    rotateY(p.rotationY);
    rotateZ(p.rotationZ);
    
    // Move to position
    translate(p.x, p.y, p.z);
    
    // Draw glowing plane with wireframe
    strokeWeight(1);
    stroke(p.hue, 80, 100, 0.8);
    noFill();
    
    // Draw a grid of lines forming the plane
    let gridSize = 20;
    let size = p.size;
    
    for (let x = -size/2; x <= size/2; x += gridSize) {
      beginShape(LINES);
      vertex(x, -size/2, 0);
      vertex(x, size/2, 0);
      endShape();
    }
    
    for (let y = -size/2; y <= size/2; y += gridSize) {
      beginShape(LINES);
      vertex(-size/2, y, 0);
      vertex(size/2, y, 0);
      endShape();
    }
    
    // Draw connecting lines between planes
    if (i > 0) {
      let prev = planes[i - 1];
      stroke(p.hue, 80, 100, 0.3);
      strokeWeight(0.5);
      line(
        p.x, p.y, p.z,
        prev.x, prev.y, prev.z
      );
    }
    
    pop();
    
    // Update rotations
    p.rotationX += rotationSpeed;
    p.rotationY += rotationSpeed * 0.7;
    p.rotationZ += rotationSpeed * 1.3;
  }
  
  // Add subtle floating points for depth effect
  stroke(200, 50, 100, 0.5);
  strokeWeight(2);
  for (let i = 0; i < 100; i++) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let z = random(-300, 300);
    
    point(x, y, z);
  }
}
