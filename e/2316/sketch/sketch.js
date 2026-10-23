let particles = [];
const totalParticles = 1500;
let structure = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Create crystalline lattice structure
  for (let i = 0; i < totalParticles; i++) {
    const angle = random(TWO_PI);
    const radius = random(50, min(width, height) * 0.4);
    const x = width/2 + cos(angle) * radius;
    const y = height/2 + sin(angle) * radius;
    
    // Create intricate lattice patterns
    const variation = map(noise(x * 0.01, y * 0.01), 0, 1, -5, 5);
    const size = map(noise(x * 0.02, y * 0.02), 0, 1, 1, 3);
    
    structure.push({
      x: x,
      y: y,
      originalX: x,
      originalY: y,
      size: size,
      angle: angle,
      radius: radius,
      color: color(random(20, 40), random(30, 60), random(40, 80)),
      stability: random(0.95, 1),
      vibration: 0,
      detached: false
    });
  }
  
  // Add inner lattice details
  for (let i = 0; i < totalParticles * 0.3; i++) {
    const angle = random(TWO_PI);
    const radius = random(20, 150);
    const x = width/2 + cos(angle) * radius;
    const y = height/2 + sin(angle) * radius;
    
    structure.push({
      x: x,
      y: y,
      originalX: x,
      originalY: y,
      size: map(noise(x * 0.02, y * 0.02), 0, 1, 0.5, 2),
      angle: angle,
      radius: radius,
      color: color(random(30, 50), random(40, 70), random(30, 60)),
      stability: random(0.9, 0.98),
      vibration: 0,
      detached: false
    });
  }
  
  // Initialize particles for decay effect
  for (let i = 0; i < totalParticles * 2; i++) {
    particles.push({
      x: width/2 + random(-100, 100),
      y: height/2 + random(-100, 100),
      size: random(0.5, 3),
      color: color(random(30, 60), random(40, 80), random(50, 90), 0.7),
      speedX: random(-0.5, 0.5),
      speedY: random(-0.5, 0.5),
      life: random(100, 300)
    });
  }
}

function draw() {
  background(0, 0, 0);
  
  time += 0.01;
  
  // Draw the lattice structure
  for (let grain of structure) {
    if (!grain.detached) {
      // Add subtle vibration effect
      grain.vibration = sin(time * 0.5 + grain.angle) * 0.3;
      
      // Apply gentle displacement
      const dx = grain.originalX - grain.x;
      const dy = grain.originalY - grain.y;
      
      // Slowly move particles outward to simulate decay
      const force = 0.001 * (1 - grain.radius / max(width, height));
      const windX = cos(time * 0.1) * force;
      const windY = sin(time * 0.1) * force;
      
      grain.x += windX + dx * 0.005 + grain.vibration * 0.5;
      grain.y += windY + dy * 0.005 + grain.vibration * 0.5;
      
      // Gradually detach particles based on displacement
      const distance = dist(grain.originalX, grain.originalY, grain.x, grain.y);
      if (distance > 15 && random() < 0.002) {
        grain.detached = true;
        
        // Create decay particle
        particles.push({
          x: grain.x,
          y: grain.y,
          size: grain.size * 0.8,
          color: grain.color,
          speedX: random(-1, 1),
          speedY: random(-1, 1),
          life: random(200, 400)
        });
      }
      
      // Draw attached particles
      fill(grain.color);
      ellipse(grain.x, grain.y, grain.size);
    }
  }
  
  // Update and draw decay particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    
    // Move particle
    p.x += p.speedX;
    p.y += p.speedY;
    
    // Fade out with life
    p.life--;
    if (p.life <= 0) {
      particles.splice(i, 1);
      continue;
    }
    
    // Apply color transition to gold/silver as it disperses
    const hue = map(p.life, 0, 400, 30, 50);  // Transition from blue to gold
    const saturation = map(p.life, 0, 400, 60, 90);
    const brightness = map(p.life, 0, 400, 60, 90);
    
    fill(hue, saturation, brightness, 0.7);
    ellipse(p.x, p.y, p.size);
  }
  
  // Create subtle cosmic dust effect
  for (let i = 0; i < 5; i++) {
    const x = width/2 + random(-100, 100);
    const y = height/2 + random(-100, 100);
    const size = random(0.5, 2);
    const hue = map(noise(x * 0.01, y * 0.01, time), 0, 1, 20, 60);
    fill(hue, 50, 80, 0.3);
    ellipse(x, y, size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
