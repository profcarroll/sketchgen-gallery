let time = 0;
let particles = [];
const numParticles = 200;
const hexRadius = 200;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize particles
  for (let i = 0; i < numParticles; i++) {
    particles.push({
      pos: createVector(random(width), random(height)),
      vel: p5.Vector.random2D().mult(random(0.5, 2)),
      hue: random(120, 300),
      size: random(2, 6)
    });
  }
}

function draw() {
  time += 0.01;
  
  // Clear with a semi-transparent layer for motion blur effect
  background(0, 0, 0, 0.05);
  
  // Draw hexagon boundary
  push();
  translate(width/2, height/2);
  stroke(200, 80, 90);
  strokeWeight(3);
  noFill();
  beginShape();
  for (let i = 0; i < 6; i++) {
    const angle = TWO_PI * i / 6;
    const x = hexRadius * cos(angle);
    const y = hexRadius * sin(angle);
    vertex(x, y);
  }
  endShape(CLOSE);
  pop();
  
  // Draw kaleidoscopic patterns
  drawKaleidoPatterns();
  
  // Update and draw particles
  for (let p of particles) {
    // Apply velocity
    p.pos.add(p.vel);
    
    // Bounce off hexagon edges
    const center = createVector(width/2, height/2);
    const distToCenter = p5.Vector.dist(p.pos, center);
    if (distToCenter > hexRadius - 10) {
      const normal = p5.Vector.sub(p.pos, center).normalize();
      const dot = p.vel.dot(normal);
      p.vel.sub(normal.mult(2 * dot));
      p.pos = p5.Vector.add(center, normal.mult(hexRadius - 10));
    }
    
    // Draw particle
    fill(p.hue, 80, 90, 0.7);
    noStroke();
    ellipse(p.pos.x, p.pos.y, p.size);
  }
}

function drawKaleidoPatterns() {
  const centerX = width/2;
  const centerY = height/2;
  
  // Draw flowing curves
  stroke(180, 90, 80, 0.5);
  strokeWeight(1);
  noFill();
  
  for (let i = 0; i < 6; i++) {
    beginShape();
    const angleOffset = time * 0.2 + i * TWO_PI / 6;
    for (let a = 0; a < TWO_PI; a += 0.1) {
      const r = 50 + sin(a * 3 + time) * 30;
      const x = centerX + cos(a + angleOffset) * r;
      const y = centerY + sin(a + angleOffset) * r;
      vertex(x, y);
    }
    endShape();
  }
  
  // Draw geometric lattice lines
  stroke(240, 70, 85, 0.6);
  strokeWeight(1);
  
  for (let i = 0; i < 12; i++) {
    const angle = time * 0.3 + i * TWO_PI / 12;
    const x1 = centerX + cos(angle) * hexRadius;
    const y1 = centerY + sin(angle) * hexRadius;
    const x2 = centerX - cos(angle) * hexRadius;
    const y2 = centerY - sin(angle) * hexRadius;
    line(x1, y1, x2, y2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
