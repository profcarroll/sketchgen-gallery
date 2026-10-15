let inkParticles = [];
let newsprintTexture;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Create newsprint texture
  newsprintTexture = createGraphics(width, height);
  newsprintTexture.noiseSeed(42);
  newsprintTexture.background(240);
  for (let i = 0; i < 1000; i++) {
    const x = random(width);
    const y = random(height);
    const sz = random(0.5, 2);
    newsprintTexture.noStroke();
    newsprintTexture.fill(200, 200, 200, 30);
    newsprintTexture.ellipse(x, y, sz, sz);
  }
  
  // Initialize ink particles
  for (let i = 0; i < 100; i++) {
    inkParticles.push({
      x: random(width),
      y: random(height),
      radius: random(1, 3),
      maxRadius: random(20, 60),
      speed: random(0.1, 0.5),
      color: color(0, 0, 0, 200),
      active: true,
      alpha: 200
    });
  }
}

function draw() {
  // Draw newsprint background
  image(newsprintTexture, 0, 0);
  
  // Add new ink particles occasionally
  if (frameCount % 30 === 0 && inkParticles.length < 500) {
    inkParticles.push({
      x: random(width),
      y: random(height),
      radius: random(1, 3),
      maxRadius: random(20, 60),
      speed: random(0.1, 0.5),
      color: color(0, 0, 0, 200),
      active: true,
      alpha: 200
    });
  }
  
  // Update and draw ink particles
  for (let i = inkParticles.length - 1; i >= 0; i--) {
    const particle = inkParticles[i];
    
    if (!particle.active) continue;
    
    // Grow the particle
    particle.radius += particle.speed;
    
    // Fade out as it spreads
    particle.alpha = map(particle.radius, 0, particle.maxRadius, 200, 0);
    
    // Draw with soft edge and color transition
    noStroke();
    fill(red(particle.color), green(particle.color), blue(particle.color), particle.alpha);
    ellipse(particle.x, particle.y, particle.radius * 2, particle.radius * 2);
    
    // Remove if it's too large
    if (particle.radius > particle.maxRadius) {
      particle.active = false;
    }
  }
  
  // Remove inactive particles
  inkParticles = inkParticles.filter(particle => particle.active);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
