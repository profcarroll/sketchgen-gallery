let gradients = [];
let particles = [];
let textElements = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create gradient fields
  for (let i = 0; i < 5; i++) {
    gradients.push({
      x: random(width),
      y: random(height),
      size: random(200, 600),
      speed: random(0.001, 0.003),
      hue: random(360)
    });
  }
  
  // Create particles
  for (let i = 0; i < 300; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      speedX: random(-0.5, 0.5),
      speedY: random(-0.5, 0.5),
      hue: random(360)
    });
  }
  
  // Create text elements
  const words = ['DATA', 'FIELDS', 'ABSTRACT', 'SHIFTS', 'RHYTHM', 'MOTION'];
  for (let i = 0; i < 8; i++) {
    textElements.push({
      text: words[i % words.length],
      x: random(width),
      y: random(height),
      speedX: random(-0.2, 0.2),
      speedY: random(-0.2, 0.2),
      size: random(16, 32),
      opacity: random(0.5, 1)
    });
  }
}

function draw() {
  background(0, 0, 10);
  
  time += 0.01;
  
  // Draw gradient fields
  for (let i = 0; i < gradients.length; i++) {
    let g = gradients[i];
    g.size += sin(time * g.speed) * 2;
    g.hue += 0.2;
    
    // Create radial gradient effect
    noStroke();
    for (let r = g.size; r > 0; r -= 5) {
      let alpha = map(r, 0, g.size, 0, 0.3);
      fill((g.hue + r * 0.1) % 360, 80, 90, alpha);
      ellipse(g.x, g.y, r * 2);
    }
  }
  
  // Update and draw particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Move particles
    p.x += p.speedX;
    p.y += p.speedY;
    
    // Bounce off edges
    if (p.x < 0 || p.x > width) p.speedX *= -1;
    if (p.y < 0 || p.y > height) p.speedY *= -1;
    
    // Keep within canvas
    p.x = constrain(p.x, 0, width);
    p.y = constrain(p.y, 0, height);
    
    // Draw particle with subtle pulse
    let pulse = sin(time * 3 + i) * 0.5 + 0.5;
    fill(p.hue, 70, 90, pulse * 0.8);
    noStroke();
    ellipse(p.x, p.y, p.size * pulse);
  }
  
  // Draw connecting lines between nearby particles
  beginShape(LINES);
  stroke(200, 50, 80, 0.2);
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let p1 = particles[i];
      let p2 = particles[j];
      
      let d = dist(p1.x, p1.y, p2.x, p2.y);
      if (d < 80) {
        let alpha = map(d, 0, 80, 0.8, 0);
        stroke(200, 50, 80, alpha);
        vertex(p1.x, p1.y);
        vertex(p2.x, p2.y);
      }
    }
  }
  endShape();
  
  // Draw text elements
  noStroke();
  for (let i = 0; i < textElements.length; i++) {
    let t = textElements[i];
    
    // Move text elements gently
    t.x += t.speedX;
    t.y += t.speedY;
    
    // Bounce off edges
    if (t.x < 0 || t.x > width) t.speedX *= -1;
    if (t.y < 0 || t.y > height) t.speedY *= -1;
    
    // Keep within canvas
    t.x = constrain(t.x, 0, width);
    t.y = constrain(t.y, 0, height);
    
    // Draw text with subtle pulsing opacity
    let pulse = sin(time * 2 + i) * 0.3 + 0.7;
    fill(240, 80, 95, t.opacity * pulse);
    textSize(t.size);
    textAlign(CENTER, CENTER);
    text(t.text, t.x, t.y);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
