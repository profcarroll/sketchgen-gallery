let shapes = [];
let colors = [];

function setup() {
  createCanvas(800, 600);
  noStroke();
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize shapes and colors
  for (let i = 0; i < 20; i++) {
    shapes.push({
      x: random(width),
      y: random(height),
      size: random(20, 100),
      speed: random(0.5, 2),
      angle: random(TWO_PI),
      type: floor(random(3)) // 0 = circle, 1 = rect, 2 = triangle
    });
  }
  
  for (let i = 0; i < 360; i++) {
    colors.push(i);
  }
}

function draw() {
  background(0, 0, 10);
  
  let time = millis() * 0.001;
  
  // Update and display shapes
  for (let i = 0; i < shapes.length; i++) {
    let s = shapes[i];
    
    // Update position and size
    s.x += cos(s.angle) * s.speed;
    s.y += sin(s.angle) * s.speed;
    s.size = 20 + 40 * sin(time * 0.5 + i);
    s.angle += 0.01;
    
    // Wrap around edges
    if (s.x < -50) s.x = width + 50;
    if (s.x > width + 50) s.x = -50;
    if (s.y < -50) s.y = height + 50;
    if (s.y > height + 50) s.y = -50;
    
    // Color modulation
    let hue = (colors[(int(time * 20 + i * 10)) % 360] + time * 20) % 360;
    fill(hue, 80, 90, 0.7);
    
    // Draw shape
    push();
    translate(s.x, s.y);
    rotate(time * 0.5 + i);
    
    if (s.type === 0) {
      ellipse(0, 0, s.size, s.size);
    } else if (s.type === 1) {
      rectMode(CENTER);
      rect(0, 0, s.size, s.size);
    } else {
      triangle(0, -s.size/2, -s.size/2, s.size/2, s.size/2, s.size/2);
    }
    
    pop();
  }
  
  // Add some pulsating lines
  stroke(255, 80, 90, 0.3);
  strokeWeight(1);
  for (let i = 0; i < 10; i++) {
    let a = time * 0.5 + i * 0.3;
    let r = 100 + 50 * sin(time * 0.7 + i);
    let x1 = width/2 + cos(a) * r;
    let y1 = height/2 + sin(a) * r;
    let x2 = width/2 + cos(a + PI) * r;
    let y2 = height/2 + sin(a + PI) * r;
    line(x1, y1, x2, y2);
  }
}
