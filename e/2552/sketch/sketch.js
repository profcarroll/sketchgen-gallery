let waves = [];
let time = 0;
let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  frameRate(30);
  
  // Initialize sound wave patterns
  for (let i = 0; i < 80; i++) {
    waves.push({
      centerX: width/2,
      centerY: height/2,
      radius: random(50, 200),
      speed: random(0.005, 0.02),
      hue: random(120, 240),
      age: 0,
      maxAge: random(300, 600),
      phase: random(TWO_PI)
    });
  }
  
  // Initialize particles for origami folding effect
  for (let i = 0; i < 300; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      speed: random(0.2, 0.8),
      angle: random(TWO_PI),
      hue: random(120, 240),
      age: 0,
      maxAge: random(150, 400)
    });
  }
}

function draw() {
  background(0, 0, 5, 0.05);
  
  time += 0.02;
  
  // Draw sound wave patterns
  for (let i = 0; i < waves.length; i++) {
    let w = waves[i];
    
    // Update wave parameters
    w.radius += sin(time * 0.5 + w.phase) * 0.3;
    w.age++;
    
    // Reset aging waves
    if (w.age > w.maxAge || w.radius < 0 || w.radius > max(width, height)) {
      w.centerX = width/2;
      w.centerY = height/2;
      w.radius = random(50, 200);
      w.speed = random(0.005, 0.02);
      w.age = 0;
      w.maxAge = random(300, 600);
      w.phase = random(TWO_PI);
    }
    
    // Draw wave rings
    stroke(w.hue, 80, 90, 0.4);
    noFill();
    ellipse(w.centerX, w.centerY, w.radius * 2);
    
    // Draw folded origami lines
    if (w.age % 15 === 0) {
      let segments = 12;
      for (let j = 0; j < segments; j++) {
        let angle = j * TWO_PI / segments + time * 0.3;
        let x1 = w.centerX + cos(angle) * (w.radius * 0.5);
        let y1 = w.centerY + sin(angle) * (w.radius * 0.5);
        let x2 = w.centerX + cos(angle) * w.radius;
        let y2 = w.centerY + sin(angle) * w.radius;
        
        stroke(w.hue, 80, 90, 0.3);
        line(x1, y1, x2, y2);
      }
    }
  }
  
  // Draw origami structure
  noStroke();
  fill(180, 90, 100, 0.6);
  for (let i = 0; i < 24; i++) {
    let angle = time * 0.2 + i * TWO_PI / 24;
    let radius = 30 + sin(time * 0.8) * 10;
    let x = width/2 + cos(angle) * radius;
    let y = height/2 + sin(angle) * radius;
    ellipse(x, y, 5);
  }
  
  // Draw expanding rings
  for (let i = 0; i < 6; i++) {
    let radius = 40 + i * 30 + sin(time * 0.7 + i) * 15;
    stroke(200, 40, 90, 0.15);
    strokeWeight(1);
    ellipse(width/2, height/2, radius * 2);
  }
  
  // Draw particles for dynamic complexity
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Update particle position with noise-based movement
    p.x += cos(p.angle) * p.speed;
    p.y += sin(p.angle) * p.speed;
    p.angle += sin(time * 0.5 + p.age * 0.01) * 0.05;
    p.age++;
    
    // Reset aging particles
    if (p.age > p.maxAge || p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
      p.x = random(width);
      p.y = random(height);
      p.angle = random(TWO_PI);
      p.age = 0;
      p.maxAge = random(150, 400);
    }
    
    // Draw particle
    fill(p.hue, 80, 90, 0.6);
    noStroke();
    ellipse(p.x, p.y, p.size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
