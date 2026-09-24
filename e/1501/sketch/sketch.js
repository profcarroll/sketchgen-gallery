let particles = [];
const particleCount = 3000;
const magneticStrength = 800;
const mouseRadius = 200;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize particles with random positions
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      size: random(0.5, 2),
      hue: random(20, 40), // metallic-looking hues
      ox: random(100),
      oy: random(100)
    });
  }
}

function draw() {
  background(0, 0, 100, 0.05); // Semi-transparent background for trail effect
  
  // Update and display particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Apply magnetic force from mouse
    let dxMouse = mouseX - p.x;
    let dyMouse = mouseY - p.y;
    let distance = sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
    
    if (distance < mouseRadius) {
      let force = map(distance, 0, mouseRadius, magneticStrength, 0);
      p.x += (dxMouse / distance) * force * 0.01;
      p.y += (dyMouse / distance) * force * 0.01;
    }
    
    // Add subtle noise-based movement
    let nx = noise(p.ox, p.oy) * 2 - 1;
    let ny = noise(p.ox + 100, p.oy + 100) * 2 - 1;
    
    p.x += nx * 0.3;
    p.y += ny * 0.3;
    
    // Update noise values for next frame
    p.ox += 0.01;
    p.oy += 0.01;
    
    // Keep particles within canvas bounds
    if (p.x < 0) p.x = 0;
    if (p.x > width) p.x = width;
    if (p.y < 0) p.y = 0;
    if (p.y > height) p.y = height;
    
    // Draw particle with metallic appearance
    noStroke();
    fill(p.hue, 80, 90, 0.8);
    ellipse(p.x, p.y, p.size, p.size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
