let particles = [];
const particleCount = 1000;
let flowField;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize particles with random positions and velocities
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      pos: createVector(random(width), random(height)),
      vel: createVector(0, 0),
      size: random(1, 3),
      hue: random(180, 240), // Turquoise to blue range
      sat: random(70, 100),
      bri: random(50, 100),
      alpha: random(0.3, 1),
      life: random(100, 300)
    });
  }
  
  // Create flow field for directional movement
  flowField = new Array(width * height).fill(0);
}

function draw() {
  // Use a dark background with gradual gradient from turquoise to black
  background(240, 100, 5, 1); // Deep blue-black with slight turquoise tint

  // Draw particles with directional flow and fading effect
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Apply some subtle noise-based movement to simulate fluid dynamics
    let angle = noise(p.pos.x * 0.01, p.pos.y * 0.01, frameCount * 0.001) * TWO_PI;
    let force = createVector(cos(angle), sin(angle));
    
    // Apply a slow downward drift with some randomness
    force.add(0, 0.02);
    
    // Update velocity and position
    p.vel.add(force);
    p.vel.mult(0.95); // Dampening to simulate fluid resistance
    p.pos.add(p.vel);
    
    // Reset particles that go off-screen or reach end of life
    if (p.pos.y > height || p.pos.x < 0 || p.pos.x > width || p.life <= 0) {
      p.pos.set(random(width), random(height * 0.2)); // Start from top area
      p.vel.set(0, 0);
      p.life = random(100, 300);
    }
    
    // Reduce life over time
    p.life -= 0.5;
    
    // Draw particle with varying color and transparency
    noStroke();
    fill(p.hue, p.sat, p.bri, p.alpha * (p.life / 300));
    ellipse(p.pos.x, p.pos.y, p.size);
  }
  
  // Handle click to create a ripple effect
  if (mouseIsPressed) {
    let r = 50;
    for (let i = 0; i < particles.length; i++) {
      let p = particles[i];
      let d = dist(p.pos.x, p.pos.y, mouseX, mouseY);
      if (d < r) {
        let force = p5.Vector.sub(p.pos, createVector(mouseX, mouseY));
        force.normalize();
        force.mult(0.5);
        p.vel.add(force);
      }
    }
  }
}

function mousePressed() {
  // Create ripple effect at click location
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    let d = dist(p.pos.x, p.pos.y, mouseX, mouseY);
    if (d < 100) {
      let force = p5.Vector.sub(p.pos, createVector(mouseX, mouseY));
      force.normalize();
      force.mult(0.8);
      p.vel.add(force);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
