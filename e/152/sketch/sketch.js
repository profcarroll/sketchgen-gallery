function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noFill();
  strokeWeight(1);
}

function draw() {
  background(20, 10, 90); // muted earthy background

  let time = millis() * 0.0002; // slow time progression
  let spacing = 40;

  for (let i = 0; i < width + height; i += spacing) {
    let offset = sin(time + i * 0.01) * 10;
    let x1 = i - offset;
    let y1 = 0;
    let x2 = 0;
    let y2 = i - offset;
    
    // Draw vertical lines
    stroke((time * 10 + i * 2) % 360, 30, 40);
    line(x1, y1, x1, height);
    
    // Draw horizontal lines
    stroke((time * 10 + i * 2 + 120) % 360, 30, 40);
    line(x2, y2, width, y2);
  }

  // Add some subtle diagonal movement
  for (let i = 0; i < 20; i++) {
    let x = (time * 10 + i * 50) % width;
    let y = (time * 8 + i * 40) % height;
    let size = 5 + sin(time + i) * 3;
    
    stroke((time * 20 + i * 30) % 360, 20, 30);
    ellipse(x, y, size, size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
