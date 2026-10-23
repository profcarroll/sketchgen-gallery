let current = [];
let waterParticles = [];
let ripples = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Create water particles with subtle movement
  for (let i = 0; i < 500; i++) {
    waterParticles.push({
      x: random(width),
      y: random(height * 0.6, height),
      size: random(0.5, 2),
      speed: random(0.1, 0.5),
      angle: random(TWO_PI),
      originalAngle: random(TWO_PI),
      hue: random(180, 220),
      saturation: random(60, 90),
      brightness: random(70, 90)
    });
  }
  
  // Initialize ripples array
  for (let i = 0; i < 20; i++) {
    ripples.push({
      x: 0,
      y: 0,
      radius: 0,
      maxRadius: random(80, 150),
      alpha: 0,
      speed: random(0.8, 1.5)
    });
  }
}

function draw() {
  // Subtle background gradient
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(10, 30, 60), color(20, 60, 100), inter);
    stroke(c);
    line(0, y, width, y);
  }
  
  // Draw water background particles
  for (let p of waterParticles) {
    // Update angle with subtle noise-based movement
    let n = noise(p.x * 0.002, p.y * 0.002, frameCount * 0.01) * TWO_PI;
    p.angle = lerp(p.angle, n, 0.05);
    
    // Apply movement with ripple interaction
    let minDist = Infinity;
    let rippleForce = { x: 0, y: 0 };
    
    for (let ripple of ripples) {
      if (ripple.alpha > 0) {
        let dx = p.x - ripple.x;
        let dy = p.y - ripple.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        
        // Only affect particles near ripples
        if (dist < ripple.maxRadius && dist > 0) {
          let force = map(dist, 0, ripple.maxRadius, 1, 0.1);
          rippleForce.x += (dx / dist) * force;
          rippleForce.y += (dy / dist) * force;
        }
      }
    }
    
    // Apply the ripple force to particle angle
    p.angle += rippleForce.x * 0.02;
    
    p.x += cos(p.angle) * p.speed;
    p.y += sin(p.angle) * p.speed;
    
    if (p.x < 0 || p.x > width) p.angle = PI - p.angle;
    if (p.y < height * 0.6 || p.y > height) p.angle = -p.angle;
    
    // Draw particle with luminous effect
    fill(p.hue, p.saturation, p.brightness, 150);
    ellipse(p.x, p.y, p.size);
  }
  
  // Update and draw ripples
  updateRipples();
}

function updateRipples() {
  for (let ripple of ripples) {
    if (ripple.alpha > 0) {
      ripple.radius += ripple.speed;
      ripple.alpha -= 1.5;
      
      // Draw ripple with luminous glow
      let c = color(200, 230, 255, ripple.alpha * 0.3);
      stroke(c);
      noFill();
      ellipse(ripple.x, ripple.y, ripple.radius * 2);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Add ripples periodically
function mousePressed() {
  addRipple(random(width), random(height * 0.6, height));
}

function addRipple(x, y) {
  // Find inactive ripple
  for (let i = 0; i < ripples.length; i++) {
    if (ripples[i].alpha <= 0) {
      ripples[i].x = x;
      ripples[i].y = y;
      ripples[i].radius = 0;
      ripples[i].alpha = 255;
      break;
    }
  }
}
