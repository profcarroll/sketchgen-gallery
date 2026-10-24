let particles = [];
const PARTICLE_COUNT = 1500;
const GRAVITY = 0.05;
const WIND = 0.01;
const DRAG = 0.99;
const FOLD_SIZE = 2;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create initial particles in a central point
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: width / 2,
      y: height / 2,
      vx: random(-0.5, 0.5),
      vy: random(-1, -0.5),
      hue: random(30, 50),
      sat: random(60, 80),
      bri: random(70, 90),
      size: random(0.5, 2),
      life: 1,
      maxLife: random(100, 200),
      rotation: random(TWO_PI),
      rotationSpeed: random(-0.05, 0.05)
    });
  }
}

function draw() {
  background(0, 0, 5, 1);
  
  // Update and display particles
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    
    // Apply physics
    p.vy += GRAVITY;
    p.vx += WIND;
    p.vx *= DRAG;
    p.vy *= DRAG;
    
    // Update position
    p.x += p.vx;
    p.y += p.vy;
    
    // Update rotation
    p.rotation += p.rotationSpeed;
    
    // Update life
    p.life -= 1 / p.maxLife;
    
    // Draw the particle as a folded origami structure
    if (p.life > 0) {
      push();
      translate(p.x, p.y);
      rotate(p.rotation);
      
      // Draw a simple folded paper shape with multiple layers
      const layerCount = 3;
      for (let j = 0; j < layerCount; j++) {
        const layerOffset = j * 0.5;
        const alpha = map(p.life, 0, 1, 0, 0.8);
        
        fill(p.hue, p.sat, p.bri, alpha);
        noStroke();
        
        // Create a simple origami fold shape (triangle with curved edges)
        beginShape();
        vertex(0, -p.size * (1 + layerOffset));
        vertex(-p.size * 0.5, p.size * (0.5 + layerOffset));
        vertex(p.size * 0.5, p.size * (0.5 + layerOffset));
        endShape(CLOSE);
      }
      
      pop();
    }
  }
  
  // Occasionally create new particles to maintain density
  if (frameCount % 10 === 0) {
    for (let i = 0; i < 2; i++) {
      particles.push({
        x: width / 2,
        y: height / 2,
        vx: random(-0.5, 0.5),
        vy: random(-1, -0.5),
        hue: random(30, 50),
        sat: random(60, 80),
        bri: random(70, 90),
        size: random(0.5, 2),
        life: 1,
        maxLife: random(100, 200),
        rotation: random(TWO_PI),
        rotationSpeed: random(-0.05, 0.05)
      });
    }
    
    // Remove old particles
    if (particles.length > PARTICLE_COUNT * 1.5) {
      particles.splice(0, 10);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
