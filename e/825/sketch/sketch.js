let particles = [];
let connections = [];
let time = 0;

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);
  
  for (let i = 0; i < 200; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5),
      size: random(2, 6),
      hue: random(360)
    });
  }
}

function draw() {
  background(0, 0, 10, 0.05);
  
  time += 0.01;
  
  // Update and display particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Apply motion
    p.x += p.vx;
    p.y += p.vy;
    
    // Boundary check
    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;
    
    // Add some swirling motion
    p.x += sin(time + i * 0.1) * 0.2;
    p.y += cos(time + i * 0.1) * 0.2;
    
    // Draw particle
    noStroke();
    fill(p.hue, 80, 90, 0.7);
    ellipse(p.x, p.y, p.size);
    
    // Draw connections to nearby particles
    for (let j = i + 1; j < particles.length; j++) {
      let other = particles[j];
      let d = dist(p.x, p.y, other.x, other.y);
      
      if (d < 80) {
        let alpha = map(d, 0, 80, 0.3, 0);
        stroke(p.hue, 60, 80, alpha);
        line(p.x, p.y, other.x, other.y);
      }
    }
  }
  
  // Add some glowing energy paths
  push();
  noFill();
  stroke(200, 50, 90, 0.1);
  strokeWeight(1);
  beginShape();
  for (let i = 0; i < 100; i++) {
    let angle = map(i, 0, 100, 0, TWO_PI * 3) + time;
    let radius = 100 + sin(time * 0.5 + i * 0.1) * 50;
    let x = width/2 + cos(angle) * radius;
    let y = height/2 + sin(angle) * radius;
    curveVertex(x, y);
  }
  endShape(CLOSE);
  pop();
}
