let patterns = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create a field of interconnected geometric patterns
  for (let i = 0; i < 150; i++) {
    patterns.push({
      x: random(width),
      y: random(height),
      size: random(20, 80),
      rotation: random(TWO_PI),
      speed: random(0.005, 0.02),
      hue: random(360)
    });
  }
}

function draw() {
  background(0);
  
  time += 0.01;
  
  // Draw interconnected geometric patterns
  strokeWeight(1);
  for (let i = 0; i < patterns.length; i++) {
    let p = patterns[i];
    
    // Update pattern position and rotation
    p.x += sin(time * p.speed) * 0.5;
    p.y += cos(time * p.speed) * 0.5;
    p.rotation += 0.01;
    
    // Wrap around canvas
    if (p.x < -50) p.x = width + 50;
    if (p.x > width + 50) p.x = -50;
    if (p.y < -50) p.y = height + 50;
    if (p.y > height + 50) p.y = -50;
    
    // Draw pattern with dynamic color
    push();
    translate(p.x, p.y);
    rotate(p.rotation);
    
    let hue = (p.hue + time * 20) % 360;
    stroke(hue, 80, 100, 0.7);
    
    // Draw interconnected lines forming geometric shapes
    beginShape();
    for (let j = 0; j < 8; j++) {
      let angle = map(j, 0, 8, 0, TWO_PI);
      let x = cos(angle) * p.size;
      let y = sin(angle) * p.size;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Draw inner lines to create woodblock print texture
    stroke(hue, 90, 100, 0.5);
    for (let j = 0; j < 4; j++) {
      let angle1 = map(j, 0, 4, 0, TWO_PI);
      let angle2 = map(j + 1, 0, 4, 0, TWO_PI);
      let x1 = cos(angle1) * p.size * 0.5;
      let y1 = sin(angle1) * p.size * 0.5;
      let x2 = cos(angle2) * p.size * 0.5;
      let y2 = sin(angle2) * p.size * 0.5;
      
      line(x1, y1, x2, y2);
    }
    
    pop();
  }
  
  // Add flowing lines to create river narrative
  noFill();
  stroke(200, 80, 100, 0.3);
  strokeWeight(1);
  
  for (let i = 0; i < 50; i++) {
    let x = (time * 20 + i * 30) % width;
    let y = sin(time * 0.5 + i * 0.2) * 200 + height/2;
    
    beginShape();
    for (let j = 0; j < 10; j++) {
      let angle = map(j, 0, 10, 0, TWO_PI);
      let xoff = cos(angle) * 30;
      let yoff = sin(angle) * 30;
      
      vertex(x + xoff, y + yoff);
    }
    endShape(CLOSE);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
