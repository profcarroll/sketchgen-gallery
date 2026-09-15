let particles = [];
let lines = [];
let bgColor;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  bgColor = color(10, 5, 20);
  
  // Initialize particles
  for (let i = 0; i < 150; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      size: random(2, 8),
      speedX: random(-2, 2),
      speedY: random(-2, 2),
      color: color(random(100, 255), random(100, 255), random(200, 255), 200)
    });
  }
  
  // Initialize lines
  for (let i = 0; i < 300; i++) {
    lines.push({
      x1: random(width),
      y1: random(height),
      x2: random(width),
      y2: random(height),
      speed: random(0.5, 2),
      opacity: random(50, 150)
    });
  }
}

function draw() {
  background(bgColor);
  
  time += 0.02;
  
  // Update and display particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Move particles
    p.x += p.speedX;
    p.y += p.speedY;
    
    // Bounce off edges
    if (p.x < 0 || p.x > width) p.speedX *= -1;
    if (p.y < 0 || p.y > height) p.speedY *= -1;
    
    // Draw particle
    fill(p.color);
    noStroke();
    ellipse(p.x, p.y, p.size);
  }
  
  // Update and display lines
  beginShape(LINES);
  for (let i = 0; i < lines.length; i++) {
    let l = lines[i];
    
    // Animate line positions
    l.x1 += sin(time * l.speed) * 0.5;
    l.y1 += cos(time * l.speed) * 0.5;
    l.x2 += cos(time * l.speed) * 0.5;
    l.y2 += sin(time * l.speed) * 0.5;
    
    // Draw line
    stroke(255, l.opacity);
    strokeWeight(1);
    vertex(l.x1, l.y1);
    vertex(l.x2, l.y2);
  }
  endShape();
  
  // Add some pulsing geometric shapes
  push();
  translate(width/2, height/2);
  rotate(time * 0.5);
  fill(255, 30);
  noStroke();
  for (let i = 0; i < 12; i++) {
    rotate(TWO_PI / 12);
    let size = 50 + sin(time * 3 + i) * 30;
    triangle(0, -size, size/2, size/2, -size/2, size/2);
  }
  pop();
  
  // Add fast-moving streaks
  stroke(255, 100);
  strokeWeight(2);
  for (let i = 0; i < 5; i++) {
    let x = (time * 100 + i * 30) % width;
    line(x, 0, x, height);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
