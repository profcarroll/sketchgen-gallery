let fogParticles = [];
let beamAngle = 0;
let beamSpeed = 0.02;
let particleCount = 3000;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize fog particles with random positions and properties
  for (let i = 0; i < particleCount; i++) {
    fogParticles.push({
      x: random(width),
      y: random(height),
      size: random(2, 8),
      speedX: random(-0.5, 0.5),
      speedY: random(-0.5, 0.5),
      hue: random(180, 240), // Blue to gray range
      sat: random(20, 50),
      bri: random(10, 30),
      alpha: random(0.1, 0.4)
    });
  }
}

function draw() {
  background(0, 0, 0);
  
  // Update and display fog particles
  for (let i = 0; i < fogParticles.length; i++) {
    let p = fogParticles[i];
    
    // Update position with chaotic motion
    p.x += p.speedX;
    p.y += p.speedY;
    
    // Wrap around edges
    if (p.x > width) p.x = 0;
    else if (p.x < 0) p.x = width;
    if (p.y > height) p.y = 0;
    else if (p.y < 0) p.y = height;
    
    // Draw fog particle
    noStroke();
    fill(p.hue, p.sat, p.bri, p.alpha);
    ellipse(p.x, p.y, p.size);
  }
  
  // Sweep beam across canvas
  beamAngle += beamSpeed;
  
  // Create a rotating beam that sweeps through the scene
  let beamWidth = 200; // Width of the beam arc
  let centerX = width / 2;
  let centerY = height / 2;
  
  // Calculate start and end angles for the beam sweep
  let startAngle = beamAngle - PI/8;
  let endAngle = beamAngle + PI/8;
  
  // Draw the light beam
  push();
  translate(centerX, centerY);
  
  // Create a radial gradient for the beam
  for (let i = 0; i < 20; i++) {
    let angle = map(i, 0, 19, startAngle, endAngle);
    let radius = map(i, 0, 19, 0, max(width, height));
    
    // Calculate beam color (bright white with a slight hue)
    let hue = (frameCount * 2) % 360;
    fill(hue, 80, 100, 0.7);
    
    // Draw segments of the beam
    arc(0, 0, radius*2, radius*2, angle, angle + 0.1);
  }
  
  pop();
  
  // Overlay the beam on fog particles to create contrast
  for (let i = 0; i < fogParticles.length; i++) {
    let p = fogParticles[i];
    
    // Calculate distance from center
    let dx = p.x - centerX;
    let dy = p.y - centerY;
    let dist = sqrt(dx*dx + dy*dy);
    
    // Check if particle is within beam range
    let angleFromCenter = atan2(dy, dx);
    let angleDiff = abs(angleFromCenter - beamAngle);
    
    // Normalize angle difference
    if (angleDiff > PI) angleDiff = TWO_PI - angleDiff;
    
    // If inside the beam's sweep
    if (angleDiff < PI/8 && dist < max(width, height)) {
      // Brighten and increase saturation of particles in beam
      fill(p.hue, p.sat * 1.5, p.bri * 3, p.alpha);
      noStroke();
      ellipse(p.x, p.y, p.size * 2);
    }
  }
}
