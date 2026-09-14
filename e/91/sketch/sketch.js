let lines = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();
  strokeWeight(1);

  // Create a dense lattice of lines
  for (let x = 0; x < width; x += 20) {
    for (let y = 0; y < height; y += 20) {
      lines.push({
        x1: x,
        y1: y,
        x2: x + random(-30, 30),
        y2: y + random(-30, 30),
        opacity: random(50, 200)
      });
    }
  }
}

function draw() {
  background(0);
  time += 0.01;

  // Draw and animate lines
  for (let i = 0; i < lines.length; i++) {
    let l = lines[i];
    
    // Slight movement over time
    let angle = time + i * 0.02;
    let offsetX = sin(angle) * 5;
    let offsetY = cos(angle) * 5;

    // Occasionally break the connection to create gaps
    if (random() < 0.01) {
      l.x2 = l.x1 + offsetX;
      l.y2 = l.y1 + offsetY;
    } else {
      l.x2 = l.x1 + offsetX + random(-10, 10);
      l.y2 = l.y1 + offsetY + random(-10, 10);
    }

    // Vary opacity for a glowing effect
    stroke(255, 255, 255, l.opacity);
    
    // Draw the line with subtle glow
    line(l.x1, l.y1, l.x2, l.y2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
