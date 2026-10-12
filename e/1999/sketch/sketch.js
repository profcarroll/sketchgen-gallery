let planes = [];
let erosion = [];
let crystals = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Create overlapping colored planes
  for (let i = 0; i < 12; i++) {
    planes.push({
      y: random(height),
      height: random(80, 250),
      color: color(random(50, 200), random(50, 180), random(100, 255), 180),
      speed: random(0.0005, 0.003),
      erosionRate: random(0.0001, 0.0005)
    });
  }
  
  // Initialize erosion patterns
  for (let i = 0; i < 200; i++) {
    erosion.push({
      x: random(width),
      y: random(height),
      size: random(2, 8),
      speed: random(0.001, 0.005),
      phase: random(TWO_PI)
    });
  }
  
  // Initialize crystal structures
  for (let i = 0; i < 300; i++) {
    crystals.push({
      x: random(width),
      y: random(height),
      size: random(1, 4),
      angle: random(TWO_PI),
      speed: random(0.002, 0.008)
    });
  }
}

function draw() {
  background(0);
  
  // Draw colored planes
  for (let i = 0; i < planes.length; i++) {
    let plane = planes[i];
    plane.y += plane.speed;
    
    // Apply erosion effect to the plane
    plane.color = lerpColor(plane.color, color(255), plane.erosionRate);
    
    // Reset plane if it goes off screen
    if (plane.y > height + plane.height) {
      plane.y = -plane.height;
      plane.color = color(random(50, 200), random(50, 180), random(100, 255), 180);
    }
    
    fill(plane.color);
    rect(0, plane.y, width, plane.height);
  }
  
  // Draw erosion effects
  for (let i = 0; i < erosion.length; i++) {
    let e = erosion[i];
    e.phase += e.speed;
    
    // Move erosion particles
    e.x += sin(frameCount * 0.002 + e.phase) * 0.5;
    e.y += cos(frameCount * 0.003 + e.phase) * 0.5;
    
    // Draw erosion particle
    fill(255, 100);
    ellipse(e.x, e.y, e.size, e.size);
    
    // Reset particles that go off screen
    if (e.x < -10 || e.x > width + 10 || e.y < -10 || e.y > height + 10) {
      e.x = random(width);
      e.y = random(height);
    }
  }
  
  // Draw crystalline structures
  for (let i = 0; i < crystals.length; i++) {
    let c = crystals[i];
    c.angle += c.speed * 0.1;
    
    // Draw crystal shape (simple geometric form)
    push();
    translate(c.x, c.y);
    rotate(c.angle);
    fill(255, 200);
    beginShape();
    for (let j = 0; j < 6; j++) {
      let angle = map(j, 0, 6, 0, TWO_PI);
      let x = cos(angle) * c.size * 3;
      let y = sin(angle) * c.size * 3;
      vertex(x, y);
    }
    endShape(CLOSE);
    pop();
    
    // Move crystals
    c.x += sin(frameCount * 0.001 + c.angle) * 0.2;
    c.y += cos(frameCount * 0.001 + c.angle) * 0.2;
    
    // Reset crystals that go off screen
    if (c.x < -50 || c.x > width + 50 || c.y < -50 || c.y > height + 50) {
      c.x = random(width);
      c.y = random(height);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
