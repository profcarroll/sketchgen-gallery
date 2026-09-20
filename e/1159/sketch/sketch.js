let particles = [];
const MAX_PARTICLES = 1000;
const MAX_RADIUS = 200;
const MIN_RADIUS = 20;
const LIFETIME = 120;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  
  for (let i = 0; i < MAX_PARTICLES; i++) {
    particles.push({
      x: 0,
      y: 0,
      r: 0,
      alpha: 0,
      age: LIFETIME,
      active: false
    });
  }
}

function draw() {
  background(0, 5);
  
  // Emit new particles occasionally
  if (frameCount % random(30, 90) === 0 || random() < 0.05) {
    emitParticle();
  }
  
  // Update and draw particles
  for (let p of particles) {
    if (p.active) {
      p.age--;
      
      if (p.age <= 0) {
        p.active = false;
      } else {
        // Growth phase: radius increases exponentially
        if (p.r < MIN_RADIUS) {
          p.r *= 1.15;
        } else if (p.r < MAX_RADIUS) {
          p.r *= 1.05;
        }
        
        // Fade in during growth, fade out after peak
        if (p.r <= MAX_RADIUS * 0.9) {
          p.alpha = map(p.age, LIFETIME, 0, 0, 100);
        } else {
          p.alpha = map(p.r, MAX_RADIUS, 0, 100, 0);
        }
        
        // Draw glow effect
        let hue = map(p.r, 0, MAX_RADIUS, 200, 0);
        fill(hue, 80, 100, p.alpha * 0.3);
        noStroke();
        ellipse(p.x, p.y, p.r * 2);
        
        // Draw inner core
        fill(hue, 100, 100, p.alpha);
        ellipse(p.x, p.y, p.r * 0.5);
      }
    }
  }
}

function emitParticle() {
  let p = particles.find(p => !p.active);
  if (!p) return;
  
  p.x = random(width);
  p.y = random(height);
  p.r = random(MIN_RADIUS * 0.3, MIN_RADIUS * 0.7);
  p.alpha = 0;
  p.age = LIFETIME;
  p.active = true;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  // Spawn particles at mouse position with a burst
  for (let i = 0; i < 10; i++) {
    let p = particles.find(p => !p.active);
    if (p) {
      p.x = mouseX;
      p.y = mouseY;
      p.r = random(5, 15);
      p.alpha = 50;
      p.age = LIFETIME;
      p.active = true;
    }
  }
}
