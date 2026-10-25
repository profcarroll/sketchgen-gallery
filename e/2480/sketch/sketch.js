let particles = [];
let centerX, centerY;
let maxRadius = 300;
let minRadius = 50;
let progress = 0;
let step = 0;
let maxSteps = 120;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  centerX = width / 2;
  centerY = height / 2;
  
  // Initialize particles in a circular formation
  for (let i = 0; i < 800; i++) {
    let angle = random(TWO_PI);
    let r = random(minRadius, maxRadius);
    
    let pos = createVector(
      centerX + r * cos(angle),
      centerY + r * sin(angle)
    );
    
    particles.push({
      pos: pos.copy(),
      originalPos: pos.copy(),
      vel: createVector(0, 0),
      size: random(1, 3),
      isMoving: false,
      age: 0
    });
  }
}

function draw() {
  // Dark background
  background(0);
  
  // Update progress
  if (frameCount % 2 === 0) {
    progress += 0.005;
    if (progress >= 1) {
      progress = 0;
      step++;
      if (step > maxSteps) step = 0;
    }
  }
  
  // Draw particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    
    if (!p.isMoving) {
      // Pull towards center
      let target = createVector(centerX, centerY);
      let force = p.originalPos.copy().sub(p.pos);
      let distance = force.mag();
      
      if (distance > 1) {
        force.normalize();
        force.mult(0.05);
        p.vel.add(force);
        p.isMoving = true;
      }
    } else {
      // Apply velocity
      p.pos.add(p.vel);
      
      // Slow down over time
      p.vel.mult(0.95);
      
      // Age particle
      p.age++;
    }
    
    // Draw particle
    noStroke();
    fill(0, 100, 100, 0.8);
    ellipse(p.pos.x, p.pos.y, p.size);
    
    // Remove if moved too far or aged out
    if (p.age > 300 || p.pos.dist(createVector(centerX, centerY)) < 5) {
      particles.splice(i, 1);
    }
  }
  
  // Create domino effect pattern
  if (step % 10 === 0 && step > 0) {
    let angle = map(step, 0, maxSteps, 0, TWO_PI);
    let r = map(step, 0, maxSteps, minRadius, maxRadius);
    
    // Draw a geometric pattern as particles converge
    stroke(0, 100, 100, 0.8);
    noFill();
    beginShape();
    for (let i = 0; i < 12; i++) {
      let a = angle + map(i, 0, 12, 0, TWO_PI);
      let x = centerX + r * cos(a);
      let y = centerY + r * sin(a);
      vertex(x, y);
    }
    endShape(CLOSE);
  }
  
  // At step 80, trigger a crystallization effect
  if (step === 80) {
    // Add some particles for the crystallization effect
    for (let i = 0; i < 50; i++) {
      let angle = random(TWO_PI);
      let r = random(100, 200);
      let pos = createVector(
        centerX + r * cos(angle),
        centerY + r * sin(angle)
      );
      
      particles.push({
        pos: pos.copy(),
        originalPos: pos.copy(),
        vel: createVector(random(-1, 1), random(-1, 1)),
        size: random(2, 4),
        isMoving: true,
        age: 0
      });
    }
  }
  
  // Draw burst particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    
    if (p.isMoving) {
      p.pos.add(p.vel);
      p.vel.mult(0.98); // Slow down over time
      p.age++;
      
      // Draw particle with randomness
      noStroke();
      fill(random(0, 360), 100, 100, 0.8);
      ellipse(p.pos.x, p.pos.y, p.size);
      
      // Remove if out of bounds or too old
      if (p.age > 200 || 
          p.pos.x < -50 || p.pos.x > width + 50 ||
          p.pos.y < -50 || p.pos.y > height + 50) {
        particles.splice(i, 1);
      }
    }
  }
  
  // Draw crystallization pattern at the end
  if (step >= 100 && step < 120) {
    let angle = map(step, 100, 120, 0, TWO_PI);
    let r = map(step, 100, 120, maxRadius * 0.8, maxRadius * 1.5);
    
    stroke(0, 100, 100, 0.8);
    noFill();
    beginShape();
    for (let i = 0; i < 24; i++) {
      let a = angle + map(i, 0, 24, 0, TWO_PI);
      let x = centerX + r * cos(a);
      let y = centerY + r * sin(a);
      vertex(x, y);
    }
    endShape(CLOSE);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  centerX = width / 2;
  centerY = height / 2;
}
