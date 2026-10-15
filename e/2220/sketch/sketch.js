// Ceramic weight cascade with rhythmic oscillation
let weights = [];
let chains = [];
const GRAVITY = 0.2;
const FRICTION = 0.98;
const SPRING = 0.05;
const NUM_WEIGHTS = 150;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Create weights and chains
  for (let i = 0; i < NUM_WEIGHTS; i++) {
    weights.push({
      x: random(width),
      y: random(height * 0.3),
      vx: 0,
      vy: 0,
      radius: random(8, 15),
      color: color(random(180, 220), random(140, 180), random(100, 140)),
      baseY: random(height * 0.3, height * 0.7)
    });
    
    // Create chains connecting weights
    if (i > 0) {
      chains.push({
        weightA: i - 1,
        weightB: i,
        length: random(40, 80)
      });
    }
  }
  
  // Add a few more connections for visual complexity
  for (let i = 0; i < 50; i++) {
    const a = floor(random(NUM_WEIGHTS));
    const b = floor(random(NUM_WEIGHTS));
    if (abs(a - b) > 1) { // Don't connect adjacent weights
      chains.push({
        weightA: a,
        weightB: b,
        length: random(60, 120)
      });
    }
  }
}

function draw() {
  background(30, 30, 35);
  
  // Apply physics to weights
  for (let i = 0; i < weights.length; i++) {
    const w = weights[i];
    
    // Gravity pull
    w.vy += GRAVITY;
    
    // Damping
    w.vx *= FRICTION;
    w.vy *= FRICTION;
    
    // Apply velocity
    w.x += w.vx;
    w.y += w.vy;
    
    // Ground collision
    if (w.y > height - 20) {
      w.y = height - 20;
      w.vy *= -0.6; // Bounce with energy loss
      w.vx *= 0.8;
    }
    
    // Boundary constraints
    if (w.x < w.radius) {
      w.x = w.radius;
      w.vx *= -0.5;
    } else if (w.x > width - w.radius) {
      w.x = width - w.radius;
      w.vx *= -0.5;
    }
  }
  
  // Update chain connections
  for (let i = 0; i < chains.length; i++) {
    const c = chains[i];
    const a = weights[c.weightA];
    const b = weights[c.weightB];
    
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const distance = sqrt(dx * dx + dy * dy);
    
    if (distance > 0) {
      const diff = (c.length - distance) / distance;
      const offsetX = dx * diff * SPRING;
      const offsetY = dy * diff * SPRING;
      
      // Apply forces to both weights
      a.vx -= offsetX * 0.5;
      a.vy -= offsetY * 0.5;
      b.vx += offsetX * 0.5;
      b.vy += offsetY * 0.5;
    }
  }
  
  // Draw chains
  stroke(180, 160, 140);
  strokeWeight(1);
  noFill();
  
  for (let i = 0; i < chains.length; i++) {
    const c = chains[i];
    const a = weights[c.weightA];
    const b = weights[c.weightB];
    
    line(a.x, a.y, b.x, b.y);
  }
  
  // Draw weights
  noStroke();
  for (let i = 0; i < weights.length; i++) {
    const w = weights[i];
    
    // Ceramic tile effect with subtle variation
    fill(w.color);
    ellipse(w.x, w.y, w.radius * 2, w.radius * 2);
    
    // Add a subtle highlight
    fill(255, 150);
    ellipse(w.x - w.radius * 0.3, w.y - w.radius * 0.3, w.radius * 0.6, w.radius * 0.6);
  }
  
  // Add a rhythmic pulse effect
  const pulse = sin(frameCount * 0.05) * 0.2 + 0.8;
  blendMode(DIFFERENCE);
  fill(255, 100);
  noStroke();
  ellipse(width/2, height/2, width * pulse, height * pulse);
  blendMode(BLEND);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
