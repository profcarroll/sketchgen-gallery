let particles = [];
let numParticles = 1500;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize particles with organic diffusion properties
  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-50, 50),
      hue: random(360),
      size: random(1, 4),
      speedX: random(-0.2, 0.2),
      speedY: random(-0.2, 0.2),
      speedZ: random(-0.1, 0.1),
      opacity: random(0.1, 0.5),
      life: random(200, 800),
      diffusion: random(0.01, 0.05)
    });
  }
}

function draw() {
  background(0, 0, 0, 0.03);
  
  time += 0.01;
  
  // Update and display particles
  beginShape(POINTS);
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    
    // Organic diffusion movement
    p.x += p.speedX + sin(time * 0.02 + i * 0.01) * p.diffusion;
    p.y += p.speedY + cos(time * 0.03 + i * 0.01) * p.diffusion;
    p.z += p.speedZ;
    
    // Slowly change hue over time
    p.hue = (p.hue + sin(time * 0.005 + i * 0.002) * 0.3) % 360;
    
    // Wrap around the canvas
    if (p.x < -width/2 - 50) p.x = width/2 + 50;
    if (p.x > width/2 + 50) p.x = -width/2 - 50;
    if (p.y < -height/2 - 50) p.y = height/2 + 50;
    if (p.y > height/2 + 50) p.y = -height/2 - 50;
    
    // Set particle color and vertex
    noStroke();
    fill(p.hue, 80, 90, p.opacity);
    vertex(p.x, p.y, p.z);
  }
  endShape();
  
  // Occasionally create new particles for dynamic effect
  if (frameCount % 15 === 0) {
    particles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-50, 50),
      hue: random(360),
      size: random(1, 4),
      speedX: random(-0.2, 0.2),
      speedY: random(-0.2, 0.2),
      speedZ: random(-0.1, 0.1),
      opacity: random(0.1, 0.5),
      life: random(200, 800),
      diffusion: random(0.01, 0.05)
    });
    
    // Remove oldest particle to keep count stable
    if (particles.length > numParticles) {
      particles.shift();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
