let particles = [];
let tension = 0;
let maxTension = 1000;
let gasCenter;
let fragmentCount = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  gasCenter = createVector(0, 0, 0);
  
  // Initialize particles in a spherical gas mass
  for (let i = 0; i < 500; i++) {
    let angle1 = random(TWO_PI);
    let angle2 = random(PI);
    let r = random(100, 300);
    
    let pos = createVector(
      r * sin(angle2) * cos(angle1),
      r * sin(angle2) * sin(angle1),
      r * cos(angle2)
    );
    
    particles.push({
      pos: pos.copy(),
      vel: createVector(0, 0, 0),
      originalPos: pos.copy(),
      size: random(2, 8),
      hue: random(180, 240),
      saturation: random(70, 90),
      brightness: random(80, 100),
      alpha: 1,
      isFragment: false,
      age: 0
    });
  }
}

function draw() {
  background(20, 30, 10);
  
  // Update tension - builds up over time
  tension = min(tension + 0.5, maxTension);
  
  // Apply spring force to particles when tension is high
  if (tension >= maxTension * 0.9) {
    for (let p of particles) {
      let force = p.originalPos.copy().sub(p.pos);
      force.normalize();
      force.mult(0.05 * tension);
      p.vel.add(force);
      
      // Mark some particles as fragments when explosion happens
      if (!p.isFragment && random() < 0.01) {
        p.isFragment = true;
        p.vel.add(createVector(random(-5, 5), random(-5, 5), random(-5, 5)));
        fragmentCount++;
      }
    }
    
    // Start explosion effect when tension reaches peak
    if (tension >= maxTension) {
      for (let p of particles) {
        if (!p.isFragment) {
          p.isFragment = true;
          p.vel.add(createVector(random(-10, 10), random(-10, 10), random(-10, 10)));
          fragmentCount++;
        }
      }
    }
  }
  
  // Update and draw particles
  beginShape(POINTS);
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    
    // Apply velocity
    p.pos.add(p.vel);
    
    // Add some gravity
    p.vel.y += 0.05;
    
    // Slow down over time
    p.vel.mult(0.95);
    
    // Age the particle
    p.age++;
    
    // Fade out as particles age or go off screen
    if (p.age > 200 || p.pos.mag() > 800) {
      p.alpha -= 0.01;
    }
    
    // Draw particle
    if (p.isFragment) {
      // Glass fragment - sharp edges
      fill(p.hue, p.saturation, p.brightness, p.alpha);
      vertex(p.pos.x, p.pos.y, p.pos.z);
      
      // Add some sparkle effect for fragments
      if (random() < 0.1) {
        fill(255, 100, 100, p.alpha * 0.7);
        vertex(p.pos.x + random(-p.size, p.size), 
               p.pos.y + random(-p.size, p.size), 
               p.pos.z + random(-p.size, p.size));
      }
    } else {
      // Gas particle - soft glow
      fill(p.hue, p.saturation, p.brightness, p.alpha * 0.3);
      vertex(p.pos.x, p.pos.y, p.pos.z);
    }
    
    // Remove dead particles
    if (p.alpha <= 0) {
      particles.splice(i, 1);
    }
  }
  endShape();
  
  // Reset tension if all particles have faded
  if (particles.length === 0) {
    tension = 0;
    fragmentCount = 0;
    
    // Re-initialize particles for next cycle
    for (let i = 0; i < 500; i++) {
      let angle1 = random(TWO_PI);
      let angle2 = random(PI);
      let r = random(100, 300);
      
      let pos = createVector(
        r * sin(angle2) * cos(angle1),
        r * sin(angle2) * sin(angle1),
        r * cos(angle2)
      );
      
      particles.push({
        pos: pos.copy(),
        vel: createVector(0, 0, 0),
        originalPos: pos.copy(),
        size: random(2, 8),
        hue: random(180, 240),
        saturation: random(70, 90),
        brightness: random(80, 100),
        alpha: 1,
        isFragment: false,
        age: 0
      });
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
