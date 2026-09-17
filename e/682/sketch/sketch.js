let skyColor;
let groundColor;
let rockColor;
let sun;
let dustDevils = [];
let scrub = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Sky colors
  skyColor = color(30, 20, 90); // Pale beige sky
  
  // Ground colors
  groundColor = color(10, 70, 25); // Deep terracotta earth
  
  // Rock colors
  rockColor = color(20, 40, 40); // Rugged rock formation
  
  // Sun position and size
  sun = {
    x: width * 0.8,
    y: height * 0.3,
    radius: 50
  };
  
  // Create dust devils
  for (let i = 0; i < 15; i++) {
    dustDevils.push({
      x: random(width),
      y: random(height * 0.6, height),
      size: random(2, 8),
      speed: random(0.2, 0.8),
      angle: random(TWO_PI),
      sway: random(-0.05, 0.05)
    });
  }
  
  // Create scrub
  for (let i = 0; i < 50; i++) {
    scrub.push({
      x: random(width),
      y: random(height * 0.6, height),
      size: random(3, 10),
      angle: random(TWO_PI)
    });
  }
}

function draw() {
  // Draw sky
  background(skyColor);
  
  // Draw distant rocks
  fill(rockColor);
  noStroke();
  for (let i = 0; i < 10; i++) {
    let x = map(i, 0, 9, width * 0.2, width * 0.8);
    let h = height * 0.4 + noise(i * 0.1) * 100;
    let w = 50 + noise(i * 0.2) * 100;
    rect(x - w/2, height - h, w, h);
  }
  
  // Draw ground with cracks
  drawCrackedGround();
  
  // Draw sun
  fill(40, 100, 100); // Yellow sun
  noStroke();
  ellipse(sun.x, sun.y, sun.radius * 2, sun.radius * 2);
  
  // Draw dust devils
  for (let devil of dustDevils) {
    // Update position
    devil.x += cos(devil.angle) * devil.speed;
    devil.y -= sin(devil.angle) * devil.speed;
    devil.angle += devil.sway;
    
    // Wrap around canvas
    if (devil.x > width + 50) devil.x = -50;
    if (devil.x < -50) devil.x = width + 50;
    if (devil.y < -50) devil.y = height + 50;
    if (devil.y > height + 50) devil.y = -50;
    
    // Draw dust devil
    noFill();
    stroke(100, 20, 80);
    strokeWeight(1);
    beginShape();
    for (let i = 0; i < 12; i++) {
      let angle = map(i, 0, 11, 0, TWO_PI);
      let radius = devil.size + sin(frameCount * 0.05 + angle) * 3;
      let x = devil.x + cos(angle) * radius;
      let y = devil.y + sin(angle) * radius;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Draw a central point
    fill(100, 20, 80);
    noStroke();
    ellipse(devil.x, devil.y, 3, 3);
  }
  
  // Draw scrub
  for (let s of scrub) {
    push();
    translate(s.x, s.y);
    rotate(s.angle);
    fill(30, 30, 50); // Dark green
    noStroke();
    beginShape();
    vertex(0, -s.size/2);
    vertex(s.size/3, s.size/2);
    vertex(-s.size/3, s.size/2);
    endShape(CLOSE);
    pop();
  }
}

function drawCrackedGround() {
  // Draw ground
  fill(groundColor);
  noStroke();
  rect(0, height * 0.6, width, height * 0.4);
  
  // Draw cracks (a few large ones and many small)
  stroke(10, 30, 10); // Darker crack color
  strokeWeight(2);
  for (let i = 0; i < 50; i++) {
    let x1 = random(width);
    let y1 = height * 0.6 + random(0, height * 0.4 - 20);
    let x2 = x1 + random(-50, 50);
    let y2 = y1 + random(-30, 30);
    line(x1, y1, x2, y2);
  }
  
  // Draw some smaller cracks
  strokeWeight(1);
  for (let i = 0; i < 100; i++) {
    let x1 = random(width);
    let y1 = height * 0.6 + random(0, height * 0.4 - 20);
    let x2 = x1 + random(-20, 20);
    let y2 = y1 + random(-10, 10);
    line(x1, y1, x2, y2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
