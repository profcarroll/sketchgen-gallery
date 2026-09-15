let flowers = [];
let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create garden flowers
  for (let i = 0; i < 20; i++) {
    flowers.push({
      x: random(width),
      y: random(height * 0.3, height * 0.7),
      size: random(40, 80),
      hue: random(360),
      stemHeight: random(60, 120),
      stemWidth: random(2, 5),
      leafCount: floor(random(3, 7)),
      leaves: []
    });
  }
  
  // Initialize flower leaves
  for (let f of flowers) {
    for (let i = 0; i < f.leafCount; i++) {
      f.leaves.push({
        angle: random(TWO_PI),
        length: random(20, 40),
        width: random(5, 15),
        swayPhase: random(TWO_PI)
      });
    }
  }
  
  // Create initial particles
  for (let i = 0; i < 300; i++) {
    createParticle();
  }
}

function draw() {
  background(200, 20, 95); // Sky blue background
  
  // Draw and update flowers
  for (let f of flowers) {
    drawFlower(f);
  }
  
  // Update and draw particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    updateParticle(p);
    drawParticle(p);
    
    // Remove dead particles
    if (p.lifespan < 0) {
      particles.splice(i, 1);
    }
  }
  
  // Occasionally add new particles to flowers
  if (frameCount % 10 === 0 && particles.length < 500) {
    createParticle();
  }
}

function drawFlower(f) {
  push();
  translate(f.x, f.y);
  
  // Draw stem
  strokeWeight(f.stemWidth);
  stroke(34, 80, 40);
  line(0, 0, 0, -f.stemHeight);
  
  // Draw leaves
  for (let leaf of f.leaves) {
    push();
    rotate(leaf.angle + sin(frameCount * 0.01 + leaf.swayPhase) * 0.2);
    noStroke();
    fill(34, 80, 50);
    ellipse(0, -f.stemHeight/2, leaf.width, leaf.length);
    pop();
  }
  
  // Draw flower center
  fill(f.hue, 80, 90);
  noStroke();
  ellipse(0, -f.stemHeight, f.size * 0.3, f.size * 0.3);
  
  // Draw petals
  for (let i = 0; i < 8; i++) {
    let angle = TWO_PI * i / 8;
    let petalSize = f.size * 0.6;
    push();
    rotate(angle + sin(frameCount * 0.02) * 0.1);
    fill(f.hue, 80, 95);
    ellipse(0, -f.stemHeight - petalSize * 0.5, petalSize, petalSize * 0.6);
    pop();
  }
  
  // Draw luminous particles in center
  let particleCount = floor(map(f.size, 40, 80, 2, 8));
  for (let i = 0; i < particleCount; i++) {
    let angle = TWO_PI * i / particleCount + frameCount * 0.01;
    let radius = f.size * 0.15;
    let px = cos(angle) * radius;
    let py = sin(angle) * radius;
    
    fill(60, 100, 100, 0.7);
    noStroke();
    ellipse(px, py - f.stemHeight, 4, 4);
  }
  
  pop();
}

function updateParticle(p) {
  p.x += p.vx;
  p.y += p.vy;
  p.lifespan -= 0.5;
  
  // Gentle attraction to flower centers
  for (let f of flowers) {
    let dx = f.x - p.x;
    let dy = f.y - p.y;
    let distance = sqrt(dx * dx + dy * dy);
    
    if (distance < f.size * 0.8 && distance > 5) {
      p.vx += dx * 0.001;
      p.vy += dy * 0.001;
    }
  }
  
  // Slow down particle
  p.vx *= 0.98;
  p.vy *= 0.98;
}

function drawParticle(p) {
  noStroke();
  fill(60, 100, 100, 0.7);
  ellipse(p.x, p.y, 3, 3);
}

function createParticle() {
  let flower = random(flowers);
  let angle = random(TWO_PI);
  let radius = random(5, 20);
  let x = flower.x + cos(angle) * radius;
  let y = flower.y + sin(angle) * radius;
  
  particles.push({
    x: x,
    y: y,
    vx: random(-1, 1),
    vy: random(-1, 1),
    lifespan: random(200, 400)
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
