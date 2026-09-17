let lines = [];
let time = 0;
let spiralAngle = 0;

function setup() {
  createCanvas(600, 600);
  colorMode(HSB, 360, 100, 100, 1);
  noFill();
  strokeWeight(1);
}

function draw() {
  background(0, 0, 0, 0.05);
  
  time += 0.02;
  spiralAngle += 0.01;

  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = min(width, height) * 0.45;
  const numLines = 150;
  
  for (let i = 0; i < numLines; i++) {
    const angle = (i / numLines) * TWO_PI * 3 + time + spiralAngle;
    const radius = map(sin(time * 2 + i * 0.1), -1, 1, 0, maxRadius);
    
    const x1 = centerX + cos(angle) * radius;
    const y1 = centerY + sin(angle) * radius;
    const x2 = centerX + cos(angle + PI/4) * (radius * 1.5);
    const y2 = centerY + sin(angle + PI/4) * (radius * 1.5);

    const hue = (i * 2 + time * 30) % 360;
    stroke(hue, 80, 90, 0.7);
    
    line(x1, y1, x2, y2);
  }
  
  // Draw central spiral pattern
  push();
  translate(centerX, centerY);
  rotate(time * 0.5);
  for (let i = 0; i < 100; i++) {
    const angle = i * 0.3 + time;
    const radius = i * 2;
    const x1 = cos(angle) * radius;
    const y1 = sin(angle) * radius;
    const x2 = cos(angle + 0.5) * (radius + 5);
    const y2 = sin(angle + 0.5) * (radius + 5);
    
    const hue = (angle * 30 + time * 50) % 360;
    stroke(hue, 80, 90, 0.5);
    line(x1, y1, x2, y2);
  }
  pop();
}
