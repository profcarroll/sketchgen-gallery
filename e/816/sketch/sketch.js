let cracks = [];
let dustDevils = [];
let scrubShapes = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Generate cracks
  for (let i = 0; i < 200; i++) {
    cracks.push({
      x: random(width),
      y: random(height * 0.7, height),
      w: random(50, 300),
      h: random(2, 10)
    });
  }
  
  // Generate dust devils
  for (let i = 0; i < 15; i++) {
    dustDevils.push({
      x: random(width),
      y: height * 0.7,
      size: random(20, 80),
      speed: random(0.5, 2),
      angle: random(TWO_PI),
      sway: random(-0.1, 0.1)
    });
  }
  
  // Generate scrub shapes
  for (let i = 0; i < 50; i++) {
    scrubShapes.push({
      x: random(width),
      y: random(height * 0.7, height),
      size: random(5, 20),
      sway: random(-0.05, 0.05)
    });
  }
}

function draw() {
  // Sky gradient
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(240, 230, 200), color(200, 180, 160), inter);
    stroke(c);
    line(0, y, width, y);
  }
  
  // Distant rock formation
  fill(150, 120, 100);
  noStroke();
  beginShape();
  vertex(0, height * 0.7);
  for (let x = 0; x < width; x += 20) {
    let y = height * 0.7 + sin(x * 0.01) * 30;
    vertex(x, y);
  }
  vertex(width, height * 0.7);
  endShape(CLOSE);
  
  // Ground texture
  fill(150, 80, 40);
  rect(0, height * 0.7, width, height * 0.3);
  
  // Draw cracks
  fill(100, 60, 30);
  for (let crack of cracks) {
    rect(crack.x, crack.y, crack.w, crack.h);
  }
  
  // Draw scrub shapes
  fill(120, 100, 80);
  for (let shape of scrubShapes) {
    ellipse(shape.x, shape.y, shape.size, shape.size * 0.6);
  }
  
  // Update and draw dust devils
  for (let devil of dustDevils) {
    // Slowly move across screen
    devil.x += devil.speed;
    devil.angle += devil.sway;
    
    // Reset if off screen
    if (devil.x > width + 100) {
      devil.x = -100;
      devil.y = height * 0.7 + random(-50, 50);
    }
    
    // Draw swirling dust devil
    noFill();
    stroke(200, 180, 160, 100);
    strokeWeight(2);
    beginShape();
    for (let i = 0; i < 8; i++) {
      let angle = devil.angle + i * PI / 4;
      let x = devil.x + cos(angle) * devil.size;
      let y = devil.y + sin(angle) * devil.size;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Draw central swirl
    stroke(220, 200, 180, 150);
    strokeWeight(1);
    beginShape();
    for (let i = 0; i < 16; i++) {
      let angle = devil.angle + i * PI / 8;
      let x = devil.x + cos(angle) * (devil.size * 0.3);
      let y = devil.y + sin(angle) * (devil.size * 0.3);
      vertex(x, y);
    }
    endShape(CLOSE);
  }
  
  // Draw shadows in cracks
  fill(80, 40, 20, 150);
  for (let crack of cracks) {
    if (random() > 0.7) {
      rect(crack.x + random(-10, 10), crack.y, crack.w * 0.3, crack.h);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
