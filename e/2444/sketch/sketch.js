let particles = [];
const PARTICLE_COUNT = 1200;
const GRAVITY = 0.03;
const WIND = 0.005;
const DRAG = 0.98;
const FOLD_SIZE = 1.5;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create initial particles in a central point
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: width / 2,
      y: height / 2,
      vx: random(-0.3, 0.3),
      vy: random(-0.8, -0.2),
      hue: random(20, 40),
      sat: random(50, 70),
      bri: random(60, 80),
      size: random(1, 3),
      life: 1,
      maxLife: random(80, 150),
      rotation: random(TWO_PI),
      rotationSpeed: random(-0.03, 0.03),
      originalX: width / 2,
      originalY: height / 2
    });
  }
}

function draw() {
  background(0, 0, 5, 1);
  
  // Update and display particles
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    
    // Apply physics with organic drift
    p.vy += GRAVITY;
    p.vx += WIND * sin(frameCount * 0.01 + i);
    p.vx *= DRAG;
    p.vy *= DRAG;
    
    // Add subtle central attraction/repulsion
    const dx = width / 2 - p.x;
    const dy = height / 2 - p.y;
    const distance = sqrt(dx * dx + dy * dy);
    
    if (distance > 50) {
      p.vx += dx * 0.0001;
      p.vy += dy * 0.0001;
    }
    
    // Update position
    p.x += p.vx;
    p.y += p.vy;
    
    // Update rotation
    p.rotation += p.rotationSpeed;
    
    // Update life
    p.life -= 1 / p.maxLife;
    
    // Draw the particle as an intricately folded paper structure
    if (p.life > 0) {
      push();
      translate(p.x, p.y);
      rotate(p.rotation);
      
      // Create a complex origami fold shape with multiple layers
      const layerCount = 4;
      for (let j = 0; j < layerCount; j++) {
        const layerOffset = j * 0.3;
        const alpha = map(p.life, 0, 1, 0, 0.7);
        
        fill(p.hue, p.sat, p.bri, alpha);
        noStroke();
        
        // Create an organic folded structure with curved edges
        beginShape();
        vertex(0, -p.size * (1 + layerOffset));
        bezierVertex(
          -p.size * 0.8, -p.size * (0.3 + layerOffset),
          p.size * 0.8, -p.size * (0.3 + layerOffset),
          0, p.size * (0.5 + layerOffset)
        );
        endShape(CLOSE);
      }
      
      pop();
    }
  }
  
  // Occasionally create new particles to maintain density
  if (frameCount % 15 === 0) {
    for (let i = 0; i < 3; i++) {
      particles.push({
        x: width / 2,
        y: height / 2,
        vx: random(-0.3, 0.3),
        vy: random(-0.8, -0.2),
        hue: random(20, 40),
        sat: random(50, 70),
        bri: random(60, 80),
        size: random(1, 3),
        life: 1,
        maxLife: random(80, 150),
        rotation: random(TWO_PI),
        rotationSpeed: random(-0.03, 0.03),
        originalX: width / 2,
        originalY: height / 2
      });
    }
    
    // Remove old particles
    if (particles.length > PARTICLE_COUNT * 1.3) {
      particles.splice(0, 5);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
