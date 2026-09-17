let particles = [];
const numParticles = 150;
const connectionDistance = 120;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize particles with random positions and hues
  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      hue: random(360),
      size: random(2, 6)
    });
  }
}

function draw() {
  background(220, 5, 5); // Deep dark background with subtle hue
  
  time += 0.01;
  
  // Draw connections between particles
  beginShape(LINES);
  noFill();
  
  for (let i = 0; i < particles.length; i++) {
    const p1 = particles[i];
    
    for (let j = i + 1; j < particles.length; j++) {
      const p2 = particles[j];
      
      // Calculate distance
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < connectionDistance) {
        // Pulse effect using sine wave
        const pulse = sin(time + i * 0.05) * 0.5 + 0.5;
        
        // Calculate alpha based on distance and pulse
        const alpha = map(distance, 0, connectionDistance, 0.8, 0.1) * pulse;
        
        // Set stroke with dynamic hue and alpha
        stroke(p1.hue, 80, 90, alpha);
        
        vertex(p1.x, p1.y);
        vertex(p2.x, p2.y);
      }
    }
  }
  
  endShape();
  
  // Draw particles
  noStroke();
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    
    // Pulse particle size and brightness
    const pulse = sin(time + i * 0.05) * 0.3 + 0.7;
    
    fill(p.hue, 80, 90, pulse);
    ellipse(p.x, p.y, p.size * pulse);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
