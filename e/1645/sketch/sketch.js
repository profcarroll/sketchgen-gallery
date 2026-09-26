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
  
  // Initialize lines with vertical flow
  for (let i = 0; i < 200; i++) {
    lines.push({
      y: random(height),
      speed: random(1, 4),
      hue: random(360),
      opacity: random(0.4, 0.9),
      width: random(1, 2)
    });
  }
}

function draw() {
  background(0);
  
  fieldTime += 0.03;
  
  // Draw interconnected vertical lines
  strokeWeight(1);
  for (let i = 0; i < lines.length; i++) {
    let segment = lines[i];
    
    // Update position with vertical flow
    segment.y += segment.speed;
    if (segment.y > height + 50) {
      segment.y = -50;
      segment.hue = (segment.hue + random(30, 60)) % 360;
    }
    
    // Draw vertical line with dynamic color and movement
    let y = segment.y + sin(fieldTime * segment.speed + i) * 15;
    
    stroke(segment.hue, 90, 100, segment.opacity);
    line(width/2, y - 30, width/2, y + 30);
  }
  
  // Add flowing particles for energy
  noStroke();
  for (let i = 0; i < 150; i++) {
    let x = (fieldTime * 20 + i * 8) % width;
    let y = (sin(fieldTime * 0.3 + i) * 250 + height/2);
    let size = sin(fieldTime + i) * 4 + 8;
    let hue = (fieldTime * 12 + i * 2) % 360;
    
    fill(hue, 90, 100, 0.7);
    ellipse(x, y, size, size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
