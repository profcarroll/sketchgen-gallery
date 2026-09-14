let shapes = [];
let colorCycle = 0;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Initialize network of shapes
  for (let i = 0; i < 20; i++) {
    shapes.push({
      x: random(width),
      y: random(height),
      size: random(30, 100),
      speed: random(0.01, 0.05),
      phase: random(TWO_PI),
      color: color(random(100, 255), random(100, 255), random(100, 255)),
      type: floor(random(3)) // 0=circle, 1=rect, 2=polygon
    });
  }
}

function draw() {
  background(10);
  
  time += 0.02;
  colorCycle = (colorCycle + 0.01) % TWO_PI;
  
  // Update and display shapes
  for (let i = 0; i < shapes.length; i++) {
    let s = shapes[i];
    
    // Oscillate position and size
    let oscillation = sin(time * s.speed + s.phase) * 0.5 + 0.5;
    let newSize = s.size * (0.8 + oscillation * 0.4);
    let newX = s.x + sin(time * s.speed + s.phase * 2) * 2;
    let newY = s.y + cos(time * s.speed + s.phase * 3) * 2;
    
    // Update color with abrupt shifts
    if (frameCount % 120 === 0) {
      s.color = color(random(100, 255), random(100, 255), random(100, 255));
    }
    
    fill(s.color);
    
    // Draw based on type
    if (s.type === 0) {
      ellipse(newX, newY, newSize);
    } else if (s.type === 1) {
      rectMode(CENTER);
      rect(newX, newY, newSize, newSize);
    } else {
      push();
      translate(newX, newY);
      rotate(time * s.speed);
      beginShape();
      for (let j = 0; j < 6; j++) {
        let angle = map(j, 0, 6, 0, TWO_PI);
        let px = cos(angle) * newSize/2;
        let py = sin(angle) * newSize/2;
        vertex(px, py);
      }
      endShape(CLOSE);
      pop();
    }
    
    // Connect to nearby shapes
    for (let j = i + 1; j < shapes.length; j++) {
      let other = shapes[j];
      let d = dist(newX, newY, other.x, other.y);
      if (d < 200) {
        stroke(255, 30);
        line(newX, newY, other.x, other.y);
      }
    }
    
    // Update shape position for next frame
    s.x = newX;
    s.y = newY;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
