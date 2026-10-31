let oilParticles = [];
let numParticles = 2000;
let uvLight;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create iridescent oil particles
  for (let i = 0; i < numParticles; i++) {
    oilParticles.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      hue: random(360),
      saturation: random(80, 100),
      brightness: random(70, 90),
      speed: random(0.1, 0.5),
      phase: random(TWO_PI)
    });
  }
  
  // Create simulated UV light source
  uvLight = {
    x: width / 2,
    y: height / 4,
    intensity: 0.8
  };
}

function draw() {
  background(0, 0, 5, 1);
  
  time += 0.01;
  
  // Draw the glass column
  drawGlassColumn();
  
  // Update and draw oil particles
  for (let particle of oilParticles) {
    // Animate particle position with organic movement
    let angle = noise(particle.x * 0.01, particle.y * 0.01, time * 0.5) * TWO_PI;
    particle.x += cos(angle) * particle.speed;
    particle.y += sin(angle) * particle.speed;
    
    // Keep particles within bounds
    if (particle.x < 0) particle.x = width;
    if (particle.x > width) particle.x = 0;
    if (particle.y < 0) particle.y = height;
    if (particle.y > height) particle.y = 0;
    
    // Particle color shifts with time and position
    let hueShift = sin(time + particle.phase) * 20 + 
                   noise(particle.x * 0.01, particle.y * 0.01) * 30;
    let sat = particle.saturation + sin(time * 0.7 + particle.phase) * 10;
    let bright = particle.brightness + cos(time * 0.5 + particle.phase) * 15;
    
    // Draw the particle
    fill((particle.hue + hueShift) % 360, sat, bright, 0.8);
    noStroke();
    ellipse(particle.x, particle.y, particle.size);
  }
  
  // Add some subtle refractive effects
  drawRefractiveEffects();
}

function drawGlassColumn() {
  // Draw the outer glass column
  fill(200, 10, 95, 0.1);
  noStroke();
  rect(width/4, 0, width/2, height);
  
  // Add inner glass surface
  fill(200, 5, 90, 0.05);
  rect(width/4 + 10, 10, width/2 - 20, height - 20);
  
  // Draw UV light effect on the column
  push();
  blendMode(LIGHTEST);
  noStroke();
  fill(240, 80, 100, 0.05);
  ellipse(uvLight.x, uvLight.y, width * 0.6, height * 0.3);
  pop();
}

function drawRefractiveEffects() {
  // Add subtle shimmer effects
  stroke(240, 80, 100, 0.05);
  strokeWeight(1);
  for (let i = 0; i < 50; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(5, 20);
    ellipse(x, y, size, size * 0.3);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
