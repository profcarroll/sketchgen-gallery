let nebulaParticles = [];
let pendulumAngle = 0;
let pendulumSpeed = 0.005;
let gradientColors = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  
  // Create gradient colors for nebula
  gradientColors = [
    color(20, 5, 30),   // Deep space blue
    color(40, 10, 60),
    color(80, 20, 100),
    color(150, 40, 180),
    color(200, 80, 220),
    color(255, 120, 255)
  ];
  
  // Generate nebula particles
  for (let i = 0; i < 2000; i++) {
    nebulaParticles.push({
      x: random(width),
      y: random(height),
      size: random(1, 8),
      speed: random(0.001, 0.005),
      angle: random(TWO_PI),
      colorIndex: floor(random(gradientColors.length)),
      pulse: random(0.5, 2)
    });
  }
}

function draw() {
  background(10);
  
  // Update pendulum
  pendulumAngle += pendulumSpeed;
  
  // Create cosmic glow effect
  let glowIntensity = sin(pendulumAngle) * 0.5 + 0.5;
  
  // Draw nebula particles with pulsing effect
  for (let particle of nebulaParticles) {
    // Move particles in wave pattern
    particle.angle += particle.speed;
    particle.x += cos(particle.angle) * 0.3;
    particle.y += sin(particle.angle) * 0.3;
    
    // Keep particles within canvas
    if (particle.x < 0) particle.x = width;
    if (particle.x > width) particle.x = 0;
    if (particle.y < 0) particle.y = height;
    if (particle.y > height) particle.y = 0;
    
    // Create radial gradient effect around pendulum
    let dx = particle.x - width/2;
    let dy = particle.y - height/2;
    let distance = sqrt(dx * dx + dy * dy);
    
    // Calculate influence of pendulum swing
    let pendulumInfluence = map(
      abs(atan2(dy, dx) - pendulumAngle), 
      0, PI, 
      0.8, 0
    );
    
    // Apply pulsing effect
    let pulse = sin(frameCount * 0.02 + particle.angle) * particle.pulse;
    
    // Calculate effective size and alpha
    let size = particle.size * (1 + pulse * 0.5);
    let alpha = map(distance, 0, width/2, 30, 10);
    alpha *= pendulumInfluence;
    
    // Draw particle with gradient color
    fill(red(gradientColors[particle.colorIndex]), 
         green(gradientColors[particle.colorIndex]), 
         blue(gradientColors[particle.colorIndex]), 
         alpha);
    
    noStroke();
    ellipse(particle.x, particle.y, size);
  }
  
  // Draw main cosmic pendulum effect
  drawPendulumEffect();
}

function drawPendulumEffect() {
  let centerX = width/2;
  let centerY = height/2;
  
  // Create pendulum arc
  push();
  translate(centerX, centerY);
  rotate(pendulumAngle);
  
  // Draw glowing arc
  noFill();
  stroke(255, 100);
  strokeWeight(2);
  arc(0, 0, width * 0.8, height * 0.8, -PI/4, PI/4);
  
  // Draw pendulum bob with radial glow
  let bobX = cos(pendulumAngle) * (width * 0.35);
  let bobY = sin(pendulumAngle) * (height * 0.35);
  
  // Create radial gradient for bob
  let gradient = drawingContext.createRadialGradient(
    bobX, bobY, 0,
    bobX, bobY, 30
  );
  
  let glowIntensity = sin(pendulumAngle * 2) * 0.5 + 0.5;
  
  gradient.addColorStop(0, color(255, 200, 100, 200 * glowIntensity));
  gradient.addColorStop(1, color(255, 100, 50, 0));
  
  drawingContext.fillStyle = gradient;
  ellipse(bobX, bobY, 60);
  
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
