let gradients = [];
let particles = [];
let textElements = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create gradient fields
  for (let i = 0; i < 5; i++) {
    gradients.push({
      x: random(width),
      y: random(height),
      size: random(200, 400),
      speed: random(0.001, 0.005),
      rotation: random(TWO_PI),
      hue: random(360)
    });
  }
  
  // Create particles
  for (let i = 0; i < 200; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      size: random(2, 8),
      speedX: random(-1, 1),
      speedY: random(-1, 1),
      hue: random(360)
    });
  }
  
  // Create text elements
  textElements = [
    { text: "DATA", x: width * 0.25, y: height * 0.3, size: 48, speed: 0.01 },
    { text: "FLOW", x: width * 0.75, y: height * 0.6, size: 36, speed: 0.015 },
    { text: "FIELDS", x: width * 0.5, y: height * 0.8, size: 24, speed: 0.008 }
  ];
}

function draw() {
  background(0, 0, 10, 0.05); // Semi-transparent background
  
  // Update and display gradients
  for (let i = 0; i < gradients.length; i++) {
    let g = gradients[i];
    
    // Update rotation
    g.rotation += g.speed;
    
    // Draw gradient field
    push();
    translate(g.x, g.y);
    rotate(g.rotation);
    
    // Create radial gradient effect
    for (let j = 0; j < 100; j++) {
      let alpha = map(j, 0, 100, 0.05, 0.3);
      let size = map(j, 0, 100, g.size, g.size * 0.2);
      let hue = (g.hue + j * 2) % 360;
      
      noStroke();
      fill(hue, 80, 90, alpha);
      
      ellipse(0, 0, size, size);
    }
    
    pop();
  }
  
  // Update and display particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Update position
    p.x += p.speedX;
    p.y += p.speedY;
    
    // Bounce off edges
    if (p.x < 0 || p.x > width) p.speedX *= -1;
    if (p.y < 0 || p.y > height) p.speedY *= -1;
    
    // Draw particle
    noStroke();
    fill(p.hue, 70, 90, 0.7);
    ellipse(p.x, p.y, p.size, p.size);
  }
  
  // Update and display text elements
  for (let i = 0; i < textElements.length; i++) {
    let t = textElements[i];
    
    // Pulsing effect
    let pulse = sin(frameCount * t.speed) * 0.3 + 0.7;
    
    textSize(t.size);
    textAlign(CENTER, CENTER);
    fill(200, 80, 90, pulse);
    text(t.text, t.x, t.y);
  }
  
  // Draw connecting lines between particles
  beginShape(LINES);
  stroke(200, 50, 80, 0.1);
  noFill();
  
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let p1 = particles[i];
      let p2 = particles[j];
      
      let d = dist(p1.x, p1.y, p2.x, p2.y);
      
      if (d < 100) {
        vertex(p1.x, p1.y);
        vertex(p2.x, p2.y);
      }
    }
  }
  
  endShape();
}
