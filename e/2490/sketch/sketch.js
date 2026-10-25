let pulseAngle = 0;
let wireStructures = [];
let numParticles = 200;
let particles = [];

function setup() {
  createCanvas(800, 600);
  
  // Create wire structures
  for (let i = 0; i < 15; i++) {
    wireStructures.push({
      x: random(width),
      y: random(height),
      points: [],
      phase: random(TWO_PI),
      scale: random(0.5, 2)
    });
    for (let j = 0; j < 20; j++) {
      wireStructures[i].points.push({
        angle: map(j, 0, 20, 0, TWO_PI),
        offset: random(0.3, 1)
      });
    }
  }
  
  // Create particles for crystal lattices
  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      z: random(-100, height * 2),
      size: random(2, 8),
      speed: random(0.05, 0.2),
      angle: random(TWO_PI),
      offset: random(TWO_PI)
    });
  }
}

function draw() {
  background(20, 20, 50);
  
  drawWireLattice();
  drawWaveform();
  drawParticles();
  
  pulseAngle += 0.02;
}

function drawWireLattice() {
  stroke(139, 69, 19);
  strokeWeight(1);
  
  for (let struct of wireStructures) {
    let centerAngle = pulseAngle + struct.phase;
    let radius = 150 * struct.scale + sin(pulseAngle + centerAngle) * 50;
    
    beginShape(LINES);
    for (let i = 0; i < struct.points.length - 1; i++) {
      let p1 = struct.points[i];
      let p2 = struct.points[i + 1];
      
      let angle1 = p1.angle + centerAngle;
      let angle2 = p2.angle + centerAngle;
      
      let x1 = struct.x + cos(angle1) * radius * p1.offset;
      let y1 = struct.y + sin(angle1) * radius * p1.offset;
      let x2 = struct.x + cos(angle2) * radius * p2.offset;
      let y2 = struct.y + sin(angle2) * radius * p2.offset;
      
      vertex(x1, y1);
      vertex(x2, y2);
    }
    endShape();
  }
}

function drawWaveform() {
  let waveformHeight = 80;
  let pulseIntensity = (sin(pulseAngle) + 1) / 2;
  
  let prevX = 0;
  let prevY = height / 2;
  
  beginShape(LINES);
  strokeWeight(3);
  for (let x = 0; x <= width; x += 10) {
    let wave = sin(map(x, 0, width, 0, TWO_PI * 5) + pulseAngle * 10) * 30;
    let pulse = sin(map(x, 0, width, 0, TWO_PI * 2) + pulseAngle * 2) * 20 * pulseIntensity;
    let y = height / 2 + wave + pulse;
    
    let hueVal = map(x, 0, width, 200, 280);
    stroke(hueVal, 200, 255);
    vertex(prevX, prevY);
    vertex(x, y);
    
    prevX = x;
    prevY = y;
  }
  endShape();
}

function drawParticles() {
  // Update and draw particles
  for (let p of particles) {
    p.y += sin(pulseAngle * 0.5 + p.offset) * p.speed * 3;
    p.x += cos(pulseAngle * 0.3 + p.offset) * p.speed * 2;
    
    // Wrap around
    if (p.y > height + p.size) p.y = -p.size;
    if (p.y < -p.size) p.y = height + p.size;
    if (p.x > width + p.size) p.x = -p.size;
    if (p.x < -p.size) p.x = width + p.size;
  }
  
  // Draw semi-transparent particles
  noStroke();
  fill(150, 100, 255, 80);
  
  for (let p of particles) {
    let sz = p.size * (0.7 + sin(pulseAngle + p.offset) * 0.15);
    ellipse(p.x, p.y, sz);
  }
  
  // Draw subtle connecting lines
  stroke(200, 180, 255, 30);
  strokeWeight(0.5);
  beginShape(LINES);
  for (let i = 0; i < particles.length - 1; i++) {
    let d = dist(particles[i].x, particles[i].y, particles[i+1].x, particles[i+1].y);
    if (d < 60) {
      vertex(particles[i].x, particles[i].y);
      vertex(particles[i+1].x, particles[i+1].y);
    }
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
