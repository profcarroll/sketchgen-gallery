let shapes = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Initialize shapes with random properties
  for (let i = 0; i < 20; i++) {
    shapes.push({
      x: random(width),
      y: random(height),
      size: random(50, 200),
      speed: random(0.01, 0.05),
      angle: random(TWO_PI),
      color: color(random(100, 255), random(100, 255), random(100, 255), 150)
    });
  }
}

function draw() {
  background(10);
  
  time += 0.01;
  
  // Update and display each shape
  for (let i = 0; i < shapes.length; i++) {
    let s = shapes[i];
    
    // Oscillate position and size
    s.x += sin(time * s.speed) * 2;
    s.y += cos(time * s.speed * 0.7) * 2;
    s.size = 100 + sin(time * s.speed * 2) * 50;
    
    // Update angle for rotation effect
    s.angle += 0.02;
    
    // Draw shape with jagged edges using noise
    push();
    translate(s.x, s.y);
    rotate(s.angle);
    fill(s.color);
    noStroke();
    
    beginShape();
    let vertices = 8 + floor(sin(time * s.speed) * 3);
    for (let j = 0; j < vertices; j++) {
      let angle = map(j, 0, vertices, 0, TWO_PI);
      let distance = s.size * (0.8 + noise(time + j * 0.5) * 0.4);
      let x = cos(angle) * distance;
      let y = sin(angle) * distance;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    pop();
    
    // Occasionally change color for visual interest
    if (frameCount % 120 === 0) {
      s.color = color(random(100, 255), random(100, 255), random(100, 255), 150);
    }
  }
  
  // Occasionally reconnect shapes by changing their positions
  if (frameCount % 300 === 0) {
    for (let i = 0; i < shapes.length; i++) {
      shapes[i].x = random(width);
      shapes[i].y = random(height);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
