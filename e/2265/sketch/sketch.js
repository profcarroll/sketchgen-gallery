let splines = [];
let latticePoints = [];
let dischargeParticles = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  frameRate(30);
  
  // Initialize splines
  for (let i = 0; i < 5; i++) {
    splines.push({
      x: random(width),
      y: random(height),
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5),
      hue: random(30, 60),
      size: random(20, 60),
      history: []
    });
  }
  
  // Initialize lattice points
  for (let i = 0; i < 100; i++) {
    latticePoints.push({
      x: random(width),
      y: random(height),
      vx: random(-0.2, 0.2),
      vy: random(-0.2, 0.2),
      size: random(2, 6),
      tension: 0,
      targetTension: random(0.5, 1)
    });
  }
  
  // Initialize discharge particles
  for (let i = 0; i < 50; i++) {
    dischargeParticles.push({
      x: random(width),
      y: random(height),
      vx: random(-2, 2),
      vy: random(-2, 2),
      life: random(10, 30),
      age: 0,
      hue: random(0, 360)
    });
  }
}

function draw() {
  background(0, 0, 5, 0.05);
  
  time += 0.01;
  
  // Update and display splines
  for (let spline of splines) {
    // Update position with noise-based movement
    let nx = noise(spline.x * 0.01, time);
    let ny = noise(spline.y * 0.01, time + 100);
    
    spline.vx += (nx - 0.5) * 0.1;
    spline.vy += (ny - 0.5) * 0.1;
    
    // Apply damping
    spline.vx *= 0.98;
    spline.vy *= 0.98;
    
    // Update position
    spline.x += spline.vx;
    spline.y += spline.vy;
    
    // Boundary check
    if (spline.x < 0 || spline.x > width) spline.vx *= -1;
    if (spline.y < 0 || spline.y > height) spline.vy *= -1;
    
    // Add to history
    spline.history.push({x: spline.x, y: spline.y});
    if (spline.history.length > 20) {
      spline.history.shift();
    }
    
    // Draw the spline path
    noFill();
    stroke(spline.hue, 80, 90, 0.4);
    strokeWeight(1);
    beginShape();
    for (let pos of spline.history) {
      vertex(pos.x, pos.y);
    }
    endShape();
    
    // Draw main blob
    fill(spline.hue, 80, 90, 0.6);
    noStroke();
    ellipse(spline.x, spline.y, spline.size);
  }
  
  // Update and display lattice points
  for (let point of latticePoints) {
    // Animate tension
    if (point.tension < point.targetTension) {
      point.tension += 0.01;
    } else if (point.tension > point.targetTension) {
      point.tension -= 0.01;
    }
    
    // Randomly change target tension for chaos effect
    if (random() < 0.01) {
      point.targetTension = random(0.5, 1);
    }
    
    // Update position with noise-based movement
    let nx = noise(point.x * 0.01, time + 50);
    let ny = noise(point.y * 0.01, time + 150);
    
    point.vx += (nx - 0.5) * 0.2;
    point.vy += (ny - 0.5) * 0.2;
    
    // Apply damping
    point.vx *= 0.95;
    point.vy *= 0.95;
    
    // Update position
    point.x += point.vx;
    point.y += point.vy;
    
    // Boundary check
    if (point.x < 0 || point.x > width) point.vx *= -1;
    if (point.y < 0 || point.y > height) point.vy *= -1;
    
    // Draw lattice point
    noStroke();
    fill(200, 50, 90, point.tension * 0.7);
    ellipse(point.x, point.y, point.size * point.tension);
    
    // Draw connections to nearby points (chaotic structure)
    for (let other of latticePoints) {
      let d = dist(point.x, point.y, other.x, other.y);
      if (d < 80 && d > 5) {
        stroke(200, 50, 90, point.tension * 0.2);
        strokeWeight(point.tension * 0.3);
        line(point.x, point.y, other.x, other.y);
      }
    }
    
    // Occasionally trigger discharge
    if (point.tension > 0.9 && random() < 0.01) {
      for (let i = 0; i < 5; i++) {
        dischargeParticles.push({
          x: point.x,
          y: point.y,
          vx: random(-3, 3),
          vy: random(-3, 3),
          life: random(20, 40),
          age: 0,
          hue: random(0, 360)
        });
      }
    }
  }
  
  // Update and display discharge particles
  for (let i = dischargeParticles.length - 1; i >= 0; i--) {
    let p = dischargeParticles[i];
    
    // Apply upward force from pressure
    p.vy -= 0.1;
    
    // Apply damping
    p.vx *= 0.95;
    p.vy *= 0.95;
    
    // Update position
    p.x += p.vx;
    p.y += p.vy;
    
    // Age particle
    p.age++;
    
    // Remove old particles
    if (p.age > p.life) {
      dischargeParticles.splice(i, 1);
      continue;
    }
    
    // Draw particle with fade-out effect
    let alpha = map(p.age, 0, p.life, 1, 0);
    fill(p.hue, 100, 100, alpha);
    noStroke();
    ellipse(p.x, p.y, 2 + (p.age / p.life) * 4);
  }
  
  // Occasionally create new splines
  if (random() < 0.005) {
    splines.push({
      x: random(width),
      y: random(height),
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5),
      hue: random(30, 60),
      size: random(20, 60),
      history: []
    });
    
    // Cap splines
    if (splines.length > 10) {
      splines.shift();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
