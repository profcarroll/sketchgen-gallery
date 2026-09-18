let lines = [];
let particles = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize lines with complex curves
  for (let i = 0; i < 200; i++) {
    let x = random(width);
    let y = random(height);
    let angle = random(TWO_PI);
    let length = random(50, 200);
    lines.push({
      x: x,
      y: y,
      angle: angle,
      length: length,
      segments: [],
      timeOffset: random(1000)
    });
  }
  
  // Initialize particles
  for (let i = 0; i < 500; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      size: random(2, 8),
      speed: random(0.5, 2),
      angle: random(TWO_PI),
      hue: random(360)
    });
  }
}

function draw() {
  background(0, 0, 10);
  time += 0.01;
  
  // Draw the kaleidoscope pattern
  push();
  translate(width/2, height/2);
  
  // Draw flowing curves (kaleidoscope phase)
  stroke(255, 80, 90, 0.7);
  noFill();
  for (let i = 0; i < lines.length; i++) {
    let l = lines[i];
    
    // Animate each line
    let t = time + l.timeOffset;
    let a1 = sin(t * 0.5) * 0.2;
    let a2 = cos(t * 0.3) * 0.3;
    
    push();
    rotate(l.angle);
    
    // Draw smooth curve segments
    beginShape();
    for (let j = 0; j < 20; j++) {
      let t2 = map(j, 0, 19, 0, TWO_PI);
      let r = l.length * (0.7 + 0.3 * sin(t2 * 2 + t));
      let x = r * cos(t2 + a1);
      let y = r * sin(t2 + a2);
      vertex(x, y);
    }
    endShape(CLOSE);
    
    pop();
  }
  
  // Draw particle flow
  noStroke();
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Update position
    p.x += cos(p.angle) * p.speed;
    p.y += sin(p.angle) * p.speed;
    
    // Bounce off edges
    if (p.x < 0 || p.x > width) p.angle = PI - p.angle;
    if (p.y < 0 || p.y > height) p.angle = -p.angle;
    
    // Add some randomness to the flow
    p.angle += random(-0.1, 0.1);
    
    // Draw particle
    fill(p.hue, 80, 90, 0.7);
    ellipse(p.x, p.y, p.size);
  }
  
  pop();
  
  // Add geometric disruption
  if (frameCount > 30) {
    stroke(200, 100, 100, 0.5);
    noFill();
    
    for (let i = 0; i < 100; i++) {
      let x = width * (i % 20) / 20;
      let y = height * floor(i/20) / 5;
      
      // Draw fractal-like lines
      beginShape();
      for (let j = 0; j < 10; j++) {
        let t = time + j * 0.3;
        let angle = map(j, 0, 9, 0, TWO_PI);
        let r = 20 + 10 * sin(t + i);
        let x1 = x + r * cos(angle);
        let y1 = y + r * sin(angle);
        vertex(x1, y1);
      }
      endShape(CLOSE);
    }
  }
  
  // Add final structured network
  if (frameCount > 60) {
    stroke(180, 100, 90, 0.4);
    noFill();
    
    for (let i = 0; i < 200; i++) {
      let x1 = random(width);
      let y1 = random(height);
      let x2 = x1 + random(-50, 50);
      let y2 = y1 + random(-50, 50);
      
      line(x1, y1, x2, y2);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
