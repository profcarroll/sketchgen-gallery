let crystalGrid;
let etchings = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  crystalGrid = createGraphics(width, height);
  crystalGrid.background(20, 30, 40);
  
  // Create crystal lattice pattern
  crystalGrid.noStroke();
  for (let i = 0; i < 1000; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(2, 8);
    let alpha = random(30, 80);
    crystalGrid.fill(100, 120, 140, alpha);
    crystalGrid.ellipse(x, y, size);
  }
  
  // Add some deeper layers
  crystalGrid.stroke(80, 100, 120, 60);
  crystalGrid.strokeWeight(1);
  for (let i = 0; i < 500; i++) {
    let x1 = random(width);
    let y1 = random(height);
    let x2 = x1 + random(-30, 30);
    let y2 = y1 + random(-30, 30);
    crystalGrid.line(x1, y1, x2, y2);
  }
  
  // Initialize etchings
  for (let i = 0; i < 50; i++) {
    etchings.push({
      x: random(width),
      y: random(height),
      size: random(10, 50),
      life: random(0.5, 1),
      speed: random(0.001, 0.005),
      angle: random(TWO_PI)
    });
  }
}

function draw() {
  background(10, 20, 30);
  
  // Draw crystal grid texture
  image(crystalGrid, -width/2, -height/2);
  
  // Add organic movement to etchings
  time += 0.01;
  
  for (let i = 0; i < etchings.length; i++) {
    let e = etchings[i];
    
    // Animate etching
    e.life += e.speed * 0.5;
    if (e.life > 1) {
      e.life = 0;
      e.x = random(width);
      e.y = random(height);
      e.size = random(10, 50);
    }
    
    // Draw etching with organic motion
    let alpha = map(e.life, 0, 1, 30, 120);
    let size = e.size * (0.5 + 0.5 * sin(time + i));
    
    push();
    translate(e.x - width/2, e.y - height/2);
    rotate(e.angle + time * 0.1);
    
    // Draw etching pattern
    noStroke();
    fill(180, 200, 220, alpha);
    
    beginShape();
    for (let j = 0; j < 8; j++) {
      let angle = map(j, 0, 7, 0, TWO_PI);
      let radius = size * (0.5 + 0.3 * sin(time * 2 + j));
      vertex(cos(angle) * radius, sin(angle) * radius);
    }
    endShape(CLOSE);
    
    // Draw subtle fracture lines
    stroke(160, 180, 200, alpha * 0.7);
    strokeWeight(0.5);
    for (let j = 0; j < 4; j++) {
      let angle = map(j, 0, 3, 0, TWO_PI);
      let startRadius = size * 0.3;
      let endRadius = size * 0.8;
      line(
        cos(angle) * startRadius,
        sin(angle) * startRadius,
        cos(angle) * endRadius,
        sin(angle) * endRadius
      );
    }
    
    pop();
  }
  
  // Add subtle floating particles for depth
  noStroke();
  for (let i = 0; i < 100; i++) {
    let x = (i * 123.456 + time * 10) % width;
    let y = (i * 789.012 + time * 5) % height;
    let size = sin(time * 0.5 + i) * 0.5 + 1;
    let alpha = map(noise(x * 0.01, y * 0.01, time), 0, 1, 20, 60);
    
    fill(150, 170, 190, alpha);
    ellipse(x - width/2, y - height/2, size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
