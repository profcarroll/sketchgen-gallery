let lines = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  noFill();
  
  // Initialize dense lattice structure with angular geometric lines
  let spacing = 25;
  for (let x = -width/2; x < width/2 + spacing; x += spacing) {
    for (let y = -height/2; y < height/2 + spacing; y += spacing) {
      lines.push({
        x1: x,
        y1: y,
        z1: 0,
        x2: x + random(-spacing/4, spacing/4),
        y2: y + random(-spacing/4, spacing/4),
        z2: 0,
        angle: random(TWO_PI),
        pulse: 0,
        speed: random(0.01, 0.03),
        baseAngle: atan2(y - height/4, x - width/4)
      });
    }
  }
}

function draw() {
  background(0);
  
  time += 0.01;
  
  // Draw and update lattice lines with harmonic wave patterns
  stroke(200, 80, 90, 0.6);
  strokeWeight(1);
  
  beginShape(LINES);
  for (let i = 0; i < lines.length; i++) {
    let l = lines[i];
    
    // Update pulse for rhythmic effect
    l.pulse += l.speed;
    
    // Create pulsing expansion and contraction
    let pulseRadius = sin(l.pulse) * 12;
    let angle = time * 0.7 + l.angle;
    
    // Angular movement with harmonic wave patterns
    let x1 = l.x1;
    let y1 = l.y1;
    let z1 = l.z1;
    let x2 = l.x2 + cos(angle) * pulseRadius;
    let y2 = l.y2 + sin(angle) * pulseRadius;
    let z2 = l.z2 + sin(time * 0.5 + l.baseAngle) * 8;
    
    // Add subtle wave distortion
    let waveDistort = sin(time * 0.3 + i * 0.015) * 4;
    x2 += waveDistort;
    y2 += waveDistort;
    
    // Draw the line segment
    vertex(x1, y1, z1);
    vertex(x2, y2, z2);
  }
  endShape();
  
  // Add central energy bursts
  push();
  translate(0, 0, sin(time * 0.5) * 15);
  rotateX(time * 0.15);
  rotateY(time * 0.2);
  stroke(100, 80, 95, 0.8);
  strokeWeight(2);
  
  beginShape(LINES);
  for (let i = 0; i < 12; i++) {
    let angle = TWO_PI * i / 12;
    let x1 = cos(angle) * 25;
    let y1 = sin(angle) * 25;
    let x2 = cos(angle) * (50 + sin(time * 0.7 + i) * 15);
    let y2 = sin(angle) * (50 + sin(time * 0.7 + i) * 15);
    vertex(x1, y1, 0);
    vertex(x2, y2, 0);
  }
  endShape();
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
