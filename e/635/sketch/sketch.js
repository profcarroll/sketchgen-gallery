let particles = [];
const particleCount = 150;
const connectionDistance = 120;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize particles with random positions and velocities
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      pos: createVector(random(width), random(height)),
      vel: p5.Vector.random2D().mult(random(0.5, 1.5)),
      size: random(8, 20),
      hue: random(360),
      pulse: random(TWO_PI)
    });
  }
}

function draw() {
  background(0, 0, 0, 0.05); // Semi-transparent background for trail effect

  time += 0.01;

  // Update and display particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Update position
    p.pos.add(p.vel);
    
    // Bounce off edges
    if (p.pos.x < 0 || p.pos.x > width) p.vel.x *= -1;
    if (p.pos.y < 0 || p.pos.y > height) p.vel.y *= -1;

    // Pulsating size and color
    let pulse = sin(p.pulse + time * 2) * 0.5 + 0.5;
    let size = p.size * (0.8 + pulse * 0.4);
    let hue = (p.hue + time * 2) % 360;

    // Draw particle
    noStroke();
    fill(hue, 100, 90, 0.7);
    ellipse(p.pos.x, p.pos.y, size);

    // Draw connections to nearby particles
    for (let j = i + 1; j < particles.length; j++) {
      let other = particles[j];
      let d = dist(p.pos.x, p.pos.y, other.pos.x, other.pos.y);
      
      if (d < connectionDistance) {
        // Fade out connections as they get further
        let alpha = map(d, 0, connectionDistance, 0.8, 0);
        
        stroke(hue, 100, 90, alpha * 0.5);
        strokeWeight(0.5);
        line(p.pos.x, p.pos.y, other.pos.x, other.pos.y);
      }
    }

    // Update pulse for next frame
    p.pulse += 0.02;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
