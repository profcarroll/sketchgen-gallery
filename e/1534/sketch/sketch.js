let lines = [];
let fieldTime = 0;
let colorPalette = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize color palette
  for (let i = 0; i < 20; i++) {
    colorPalette.push(color(random(360), 90, 100));
  }
  
  // Initialize lines
  for (let i = 0; i < 150; i++) {
    lines.push({
      y: random(height),
      speed: random(0.5, 2),
      hue: random(360),
      opacity: random(0.3, 0.8),
      width: random(1, 3)
    });
  }
}

function draw() {
  background(0);
  
  fieldTime += 0.02;
  
  // Draw interconnected lines
  strokeWeight(1);
  for (let i = 0; i < lines.length; i++) {
    let segment = lines[i];
    
    // Update position
    segment.y += segment.speed;
    if (segment.y > height + 50) {
      segment.y = -50;
      segment.hue = (segment.hue + random(30, 60)) % 360;
    }
    
    // Draw line with dynamic color and movement
    let x1 = -50;
    let x2 = width + 50;
    let y = segment.y + sin(fieldTime * segment.speed + i) * 20;
    
    stroke(segment.hue, 90, 100, segment.opacity);
    line(x1, y, x2, y);
  }
  
  // Add glowing particles for energy
  noStroke();
  for (let i = 0; i < 100; i++) {
    let x = (fieldTime * 30 + i * 10) % width;
    let y = (sin(fieldTime * 0.5 + i) * 200 + height/2);
    let size = sin(fieldTime + i) * 5 + 10;
    let hue = (fieldTime * 10 + i * 3) % 360;
    
    fill(hue, 90, 100, 0.7);
    ellipse(x, y, size, size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
