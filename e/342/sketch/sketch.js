let gradients = [];
let particles = [];
let typography = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create gradient layers
  for (let i = 0; i < 5; i++) {
    gradients.push({
      speed: random(0.001, 0.003),
      rotation: random(TWO_PI),
      scale: random(0.5, 2),
      hue: random(360)
    });
  }
  
  // Create data particles
  for (let i = 0; i < 100; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      size: random(2, 8),
      speedX: random(-0.5, 0.5),
      speedY: random(-0.5, 0.5),
      pulse: random(PI)
    });
  }
  
  // Create typography elements
  const words = ['DATA', 'FLOW', 'NETWORK', 'SYSTEM', 'PROCESS'];
  for (let i = 0; i < 8; i++) {
    typography.push({
      text: random(words),
      x: random(width),
      y: random(height),
      speed: random(0.001, 0.003),
      rotation: random(TWO_PI),
      size: random(20, 40)
    });
  }
}

function draw() {
  time += 0.01;
  
  // Clear with a subtle fade
  fill(0, 0, 0, 0.05);
  noStroke();
  rect(0, 0, width, height);
  
  // Draw gradients
  for (let i = 0; i < gradients.length; i++) {
    const g = gradients[i];
    g.rotation -= g.speed;
    g.hue = (g.hue + 0.2) % 360;
    
    push();
    translate(width/2, height/2);
    rotate(g.rotation);
    
    // Create gradient effect with multiple circles
    for (let j = 0; j < 10; j++) {
      const radius = (width + height) * 0.3 * g.scale * (j / 10);
      const alpha = map(j, 0, 10, 0.05, 0.2);
      const hue = (g.hue + j * 10) % 360;
      
      noFill();
      stroke(hue, 80, 90, alpha);
      ellipse(0, 0, radius, radius);
    }
    
    pop();
  }
  
  // Draw pulsing connections between particles
  beginShape(LINES);
  for (let i = 0; i < particles.length; i++) {
    const p1 = particles[i];
    for (let j = i + 1; j < particles.length; j++) {
      const p2 = particles[j];
      
      // Calculate distance
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const dist = sqrt(dx * dx + dy * dy);
      
      // Only connect if within range
      if (dist < 150) {
        const alpha = map(dist, 0, 150, 0.8, 0);
        stroke(200, 30, 80, alpha * 0.5);
        vertex(p1.x, p1.y);
        vertex(p2.x, p2.y);
      }
    }
  }
  endShape();
  
  // Draw particles
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    
    // Update position
    p.x += p.speedX;
    p.y += p.speedY;
    
    // Bounce off edges
    if (p.x < 0 || p.x > width) p.speedX *= -1;
    if (p.y < 0 || p.y > height) p.speedY *= -1;
    
    // Pulsing effect
    p.pulse += 0.05;
    const pulseSize = p.size + sin(p.pulse) * 2;
    
    fill(200, 50, 90, 0.7);
    noStroke();
    ellipse(p.x, p.y, pulseSize);
  }
  
  // Draw kinetic typography
  for (let i = 0; i < typography.length; i++) {
    const t = typography[i];
    
    push();
    translate(t.x, t.y);
    rotate(t.rotation);
    
    t.rotation += t.speed * 0.5;
    
    fill(200, 80, 90, 0.6);
    noStroke();
    textSize(t.size);
    textAlign(CENTER, CENTER);
    text(t.text, 0, 0);
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
