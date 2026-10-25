let kaleidoLines = [];
let time = 0;
let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  frameRate(30);
  
  // Initialize kaleidoscopic lines
  for (let i = 0; i < 200; i++) {
    kaleidoLines.push({
      angle: random(TWO_PI),
      radius: random(width * 0.3, width * 0.45),
      speed: random(0.001, 0.005),
      hue: random(180, 240),
      age: 0,
      maxAge: random(200, 400),
      phase: random(TWO_PI)
    });
  }
  
  // Initialize particles for fractal effect
  for (let i = 0; i < 500; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      size: random(0.5, 2),
      speed: random(0.1, 0.5),
      angle: random(TWO_PI),
      hue: random(180, 240),
      age: 0,
      maxAge: random(100, 300)
    });
  }
}

function draw() {
  background(0, 0, 5, 0.03);
  
  time += 0.01;
  
  // Draw kaleidoscopic symmetry
  strokeWeight(1);
  for (let i = 0; i < 6; i++) {
    let angle = time * 0.5 + i * TWO_PI / 6;
    let radius = min(width, height) * 0.4;
    let x1 = width/2 + cos(angle) * radius;
    let y1 = height/2 + sin(angle) * radius;
    let x2 = width/2 + cos(angle + PI) * radius;
    let y2 = height/2 + sin(angle + PI) * radius;
    stroke(200, 50, 90, 0.15);
    line(x1, y1, x2, y2);
  }
  
  // Draw evolving geometric patterns
  for (let i = 0; i < kaleidoLines.length; i++) {
    let l = kaleidoLines[i];
    
    // Update line parameters
    l.angle += l.speed * sin(time * 0.3 + l.phase) * 0.5;
    l.radius += sin(time * 0.2 + l.phase) * 0.3;
    l.age++;
    
    // Reset aging lines
    if (l.age > l.maxAge || l.radius < 0 || l.radius > width * 0.5) {
      l.angle = random(TWO_PI);
      l.radius = random(width * 0.3, width * 0.45);
      l.speed = random(0.001, 0.005);
      l.age = 0;
      l.maxAge = random(200, 400);
      l.phase = random(TWO_PI);
    }
    
    // Draw the line
    let x1 = width/2 + cos(l.angle) * l.radius;
    let y1 = height/2 + sin(l.angle) * l.radius;
    let x2 = width/2 + cos(l.angle + PI) * l.radius;
    let y2 = height/2 + sin(l.angle + PI) * l.radius;
    
    stroke(l.hue, 80, 90, 0.6);
    line(x1, y1, x2, y2);
    
    // Draw connecting lines for fractal effect
    if (l.age % 10 === 0) {
      let d = dist(x1, y1, x2, y2); // renamed from 'dist' to avoid conflict
      let segments = floor(d / 30);
      for (let j = 0; j < segments; j++) {
        let t = j / segments;
        let px = lerp(x1, x2, t);
        let py = lerp(y1, y2, t);
        
        // Add slight offset to create fractal texture
        let offset = sin(time * 0.5 + t) * 3;
        let offAngle = l.angle + PI/2;
        px += cos(offAngle) * offset;
        py += sin(offAngle) * offset;
        
        stroke(l.hue, 80, 90, 0.3);
        point(px, py);
      }
    }
  }
  
  // Draw central crystalline structure
  noStroke();
  fill(180, 90, 100, 0.4);
  for (let i = 0; i < 12; i++) {
    let angle = time * 0.3 + i * TWO_PI / 12;
    let radius = 20 + sin(time * 0.7) * 5;
    let x = width/2 + cos(angle) * radius;
    let y = height/2 + sin(angle) * radius;
    ellipse(x, y, 3);
  }
  
  // Draw expanding rings
  for (let i = 0; i < 8; i++) {
    let radius = 30 + i * 20 + sin(time * 0.5 + i) * 10;
    stroke(200, 40, 90, 0.1);
    strokeWeight(0.5);
    ellipse(width/2, height/2, radius * 2);
  }
  
  // Draw particles for dynamic complexity
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Update particle position
    p.x += cos(p.angle) * p.speed;
    p.y += sin(p.angle) * p.speed;
    p.age++;
    
    // Reset aging particles
    if (p.age > p.maxAge || p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
      p.x = random(width);
      p.y = random(height);
      p.angle = random(TWO_PI);
      p.age = 0;
      p.maxAge = random(100, 300);
    }
    
    // Draw particle
    fill(p.hue, 80, 90, 0.5);
    noStroke();
    ellipse(p.x, p.y, p.size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
