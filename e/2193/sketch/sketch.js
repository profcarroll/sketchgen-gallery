let particles = [];
let crystals = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize particles for nebula dust - batched into one shape
  for (let i = 0; i < 1000; i++) {
    particles.push({
      x: random(-width, width),
      y: random(-height, height),
      z: random(-500, 500),
      speed: random(0.1, 0.5),
      angle: random(TWO_PI),
      size: random(0.5, 2),
      opacity: random(0.1, 0.3)
    });
  }
  
  // Create crystal formations
  for (let i = 0; i < 50; i++) {
    crystals.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-500, -100),
      size: random(20, 80),
      angle: random(TWO_PI)
    });
  }
}

function draw() {
  background(200, 90, 10);
  
  // Create deep blue gradient background
  drawGradient();
  
  // Draw bioluminescent crystals
  drawCrystals();
  
  // Animate nebula dust particles - batched into one shape
  animateParticles();
  
  time += 0.005;
}

function drawGradient() {
  // Create a deep, vast oceanic gradient
  for (let y = -height/2; y < height/2; y += 10) {
    let inter = map(y, -height/2, height/2, 0, 1);
    let c = lerpColor(color(200, 90, 15), color(200, 80, 5), inter);
    stroke(c);
    line(-width/2, y, width/2, y);
  }
}

function drawCrystals() {
  noStroke();
  
  for (let crystal of crystals) {
    push();
    
    // Position
    translate(crystal.x, crystal.y, crystal.z);
    
    // Rotate slightly for organic look
    rotateX(frameCount * 0.001 + crystal.angle);
    rotateY(frameCount * 0.002 + crystal.angle * 0.5);
    
    // Crystal color - deep blue with iridescence
    let hue = (200 + sin(time + crystal.x * 0.001) * 10) % 360;
    fill(hue, 80, 90, 0.7);
    
    // Draw a simple crystal shape using a combination of geometric forms
    push();
    rotateX(PI/4);
    scale(crystal.size * 0.5, crystal.size, crystal.size * 0.5);
    sphere(crystal.size * 0.3, 6, 4);
    pop();
    
    push();
    rotateY(PI/4);
    scale(crystal.size, crystal.size * 0.5, crystal.size * 0.5);
    sphere(crystal.size * 0.3, 6, 4);
    pop();
    
    push();
    scale(crystal.size * 0.5, crystal.size * 0.5, crystal.size);
    sphere(crystal.size * 0.3, 6, 4);
    pop();
    
    pop();
  }
}

function animateParticles() {
  // Draw nebula dust with additive blending
  blendMode(ADD);
  
  noStroke();
  
  beginShape(POINTS);
  for (let particle of particles) {
    // Update position with noise
    let nX = noise(particle.x * 0.003, particle.y * 0.003, time) * 5;
    let nY = noise(particle.x * 0.003 + 1000, particle.y * 0.003 + 1000, time) * 5;
    
    particle.x += cos(particle.angle) * particle.speed + nX;
    particle.y += sin(particle.angle) * particle.speed + nY;
    
    // Wrap around edges
    if (particle.x > width/2 + 100) particle.x = -width/2 - 100;
    if (particle.x < -width/2 - 100) particle.x = width/2 + 100;
    if (particle.y > height/2 + 100) particle.y = -height/2 - 100;
    if (particle.y < -height/2 - 100) particle.y = height/2 + 100;
    
    // Set particle color and vertex
    fill(200, 70, 80, particle.opacity);
    vertex(particle.x, particle.y, particle.z);
  }
  endShape();
  
  blendMode(BLEND);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
