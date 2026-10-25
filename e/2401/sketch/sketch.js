let lines = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noFill();
  
  // Initialize lattice structure with angular geometric lines
  let spacing = 40;
  for (let x = 0; x < width + spacing; x += spacing) {
    for (let y = 0; y < height + spacing; y += spacing) {
      lines.push({
        x1: x,
        y1: y,
        x2: x + random(-spacing/2, spacing/2),
        y2: y + random(-spacing/2, spacing/2),
        angle: random(TWO_PI),
        pulse: 0,
        speed: random(0.02, 0.05)
      });
    }
  }
}

function draw() {
  background(0);
  
  time += 0.02;
  
  // Draw and update lattice lines
  stroke(60, 80, 90, 0.7);
  strokeWeight(1);
  
  for (let i = 0; i < lines.length; i++) {
    let l = lines[i];
    
    // Update pulse for rhythmic effect
    l.pulse += l.speed;
    
    // Angular movement and pulse-based expansion
    let pulseRadius = sin(l.pulse) * 20;
    let angle = time * 0.5 + l.angle;
    
    // Create sharp, angular geometric forms
    let x1 = l.x1;
    let y1 = l.y1;
    let x2 = l.x2 + cos(angle) * pulseRadius;
    let y2 = l.y2 + sin(angle) * pulseRadius;
    
    // Draw the line
    line(x1, y1, x2, y2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
