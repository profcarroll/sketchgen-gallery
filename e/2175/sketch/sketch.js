let particles = [];
let beeswaxColor;
let decayColor;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Warm golden beeswax palette
  beeswaxColor = color(40, 80, 95);
  decayColor = color(30, 60, 75);
  
  // Create initial solid particles (architecture elements)
  for (let i = 0; i < 200; i++) {
    let x = random(width);
    let y = random(height * 0.2, height * 0.8);
    let size = random(15, 40);
    particles.push({
      x: x,
      y: y,
      size: size,
      originalSize: size,
      isSolid: true,
      color: beeswaxColor,
      vx: random(-0.1, 0.1),
      vy: random(-0.1, 0.1),
      shrinkRate: random(0.0005, 0.0015),
      morphProgress: 0,
      age: 0
    });
  }
}

function draw() {
  // Slowly fade the background to simulate decay
  fill(30, 20, 85, 0.03);
  rect(0, 0, width, height);
  
  // Update and draw particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    if (p.isSolid) {
      // Solid architecture elements slowly shrink
      p.size -= p.shrinkRate;
      p.age += 1;
      
      // Move particles with subtle gravity and slight randomness
      p.x += p.vx;
      p.y += p.vy;
      
      // Add gentle wobble
      p.x += sin(frameCount * 0.02 + i) * 0.03;
      p.y += cos(frameCount * 0.015 + i) * 0.03;
      
      // Boundary checks with slight bounce
      if (p.x < 0 || p.x > width) p.vx *= -0.9;
      if (p.y < 0 || p.y > height) p.vy *= -0.9;
      
      // When particles get small, they become amorphous
      if (p.size <= 5 || p.age > 1000) {
        p.isSolid = false;
        p.morphProgress = 0;
        p.color = decayColor;
      }
      
      // Draw solid particle with beeswax texture effect
      fill(p.color);
      rectMode(CENTER);
      push();
      translate(p.x, p.y);
      rotate(frameCount * 0.003 + i * 0.1);
      rect(0, 0, p.size, p.size);
      pop();
      
    } else {
      // Amorphous particles flow and merge
      p.morphProgress += 0.002;
      
      // Flow towards center with some randomness
      let dx = width/2 - p.x;
      let dy = height/2 - p.y;
      let dist = sqrt(dx*dx + dy*dy);
      
      if (dist > 1) {
        p.x += (dx / dist) * 0.03;
        p.y += (dy / dist) * 0.03;
      }
      
      // Add some random movement
      p.x += random(-0.1, 0.1);
      p.y += random(-0.1, 0.1);
      
      // Grow slightly over time
      if (p.size < 20) {
        p.size += 0.015;
      }
      
      // Draw as soft blob with gradient effect
      let alpha = map(p.morphProgress, 0, 1, 0, 0.7);
      fill(red(p.color), green(p.color), blue(p.color), alpha);
      
      // Create a more organic shape by drawing multiple overlapping ellipses
      for (let j = 0; j < 2; j++) {
        let offset = random(-p.size * 0.3, p.size * 0.3);
        ellipse(p.x + offset, p.y + offset, p.size, p.size);
      }
    }
  }
  
  // Occasionally transform solid particles into amorphous ones
  if (random() < 0.0005) {
    let solidParticles = particles.filter(p => p.isSolid);
    if (solidParticles.length > 0) {
      let target = random(solidParticles);
      target.isSolid = false;
      target.morphProgress = 0;
      target.color = decayColor;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
