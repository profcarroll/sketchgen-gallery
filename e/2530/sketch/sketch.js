let cracks = [];
let particles = [];
const PARTICLE_COUNT = 500;
const CRACK_COUNT = 3;
const MAX_CRACK_LENGTH = 800;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize cracks
  for (let i = 0; i < CRACK_COUNT; i++) {
    cracks.push({
      x: random(width),
      y: random(height),
      angle: random(TWO_PI),
      speed: random(0.5, 1.5),
      length: 0,
      maxLen: random(300, MAX_CRACK_LENGTH)
    });
  }
  
  // Initialize particles
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      size: random(1, 4),
      speedX: random(-2, 2),
      speedY: random(-2, 2),
      color: color(random(20, 40), 80, 90, 0.8),
      life: random(100, 300)
    });
  }
}

function draw() {
  background(0, 0, 5, 1);
  
  // Update and draw cracks
  for (let i = 0; i < cracks.length; i++) {
    let crack = cracks[i];
    
    // Update crack position
    crack.x += cos(crack.angle) * crack.speed;
    crack.y += sin(crack.angle) * crack.speed;
    crack.length += crack.speed;
    
    // Draw crack
    stroke(20, 80, 90, 0.7);
    strokeWeight(1);
    line(crack.x, crack.y, crack.x - cos(crack.angle) * crack.length, crack.y - sin(crack.angle) * crack.length);
    
    // Create new particles when crack moves
    if (frameCount % 5 === 0 && crack.length > 50) {
      for (let j = 0; j < 3; j++) {
        particles.push({
          x: crack.x,
          y: crack.y,
          size: random(1, 3),
          speedX: random(-3, 3),
          speedY: random(-3, 3),
          color: color(random(20, 40), 80, 90, 0.8),
          life: random(100, 200)
        });
      }
    }
    
    // Reset crack if it reaches max length or goes off screen
    if (crack.length > crack.maxLen || 
        crack.x < -50 || crack.x > width + 50 || 
        crack.y < -50 || crack.y > height + 50) {
      crack.x = random(width);
      crack.y = random(height);
      crack.angle = random(TWO_PI);
      crack.length = 0;
      crack.maxLen = random(300, MAX_CRACK_LENGTH);
    }
  }
  
  // Update and draw particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Apply movement
    p.x += p.speedX;
    p.y += p.speedY;
    p.life--;
    
    // Draw particle as a sharp geometric flake
    push();
    translate(p.x, p.y);
    rotate(frameCount * 0.02);
    fill(p.color);
    noStroke();
    
    // Draw triangular flake
    beginShape();
    vertex(0, -p.size);
    vertex(-p.size, p.size);
    vertex(p.size, p.size);
    endShape(CLOSE);
    
    pop();
    
    // Remove dead particles
    if (p.life <= 0) {
      particles.splice(i, 1);
      i--;
    }
  }
  
  // Add new particles occasionally for continuous flow
  if (frameCount % 2 === 0) {
    particles.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      speedX: random(-2, 2),
      speedY: random(-2, 2),
      color: color(random(20, 40), 80, 90, 0.8),
      life: random(100, 300)
    });
    
    // Keep particle count manageable
    if (particles.length > PARTICLE_COUNT + 100) {
      particles.splice(0, 50);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
