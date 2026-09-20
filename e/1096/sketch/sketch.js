let lines = [];
let maxLines = 500;
let fadeRate = 0.02;

function setup() {
  createCanvas(windowWidth, windowHeight);
  stroke(255, 255, 255, 200);
  strokeWeight(1);
  noFill();
}

function draw() {
  // Fade the background slightly each frame for trail effect
  fill(0, 15);
  noStroke();
  rect(0, 0, width, height);
  
  // Generate a new arc at a random position
  if (lines.length < maxLines && random() < 0.3) {
    let x = random(width);
    let y = random(height);
    let radius = random(30, 150);
    let angle = random(TWO_PI);
    
    lines.push({
      x: x,
      y: y,
      radius: radius,
      angle: angle,
      alpha: 1
    });
  }
  
  // Draw all lines with current properties
  for (let i = lines.length - 1; i >= 0; i--) {
    let line = lines[i];
    
    // Fade the line
    line.alpha -= fadeRate * random(0.5, 1.5);
    
    if (line.alpha <= 0 || line.alpha > 1) {
      // Remove faded lines
      lines.splice(i, 1);
      continue;
    }
    
    stroke(255, 255, 255, line.alpha * 200);
    strokeWeight(line.alpha * 1.5);
    
    beginShape();
    for (let theta = 0; theta < TWO_PI; theta += PI / 12) {
      let nx = line.x + line.radius * cos(theta + line.angle);
      let ny = line.y + line.radius * sin(theta + line.angle);
      vertex(nx, ny);
    }
    endShape();
  }
}

function mousePressed() {
  lines = [];
  fill(0);
  noStroke();
  rect(0, 0, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
