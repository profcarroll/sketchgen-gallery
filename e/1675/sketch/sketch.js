let particles = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Initialize particles with fewer shapes for performance
  for (let i = 0; i < 500; i++) {
    particles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-1000, 1000),
      size: random(2, 10),
      speed: random(0.01, 0.1),
      angle: random(TWO_PI),
      hue: random(190, 230),
      opacity: random(0.05, 0.15),
      sway: random(0.002, 0.008),
      depth: random(1)
    });
  }
}

function draw() {
  // Deep blue gradient background
  background(210, 50, 25);
  
  time += 0.002;
  
  // Draw all particles as points for performance
  beginShape(POINTS);
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Slow drift movement with current field influence
    let currentX = map(noise(p.x * 0.001, p.y * 0.001, time * 0.01), 0, 1, -0.5, 0.5);
    let currentY = map(noise(p.x * 0.001 + 1000, p.y * 0.001 + 1000, time * 0.01), 0, 1, -0.5, 0.5);
    
    p.x += currentX * 0.1;
    p.y += currentY * 0.1;
    
    // Add gentle sway and depth effect
    p.x += sin(time + p.y * 0.01 + p.depth) * p.sway;
    p.y += cos(time * 0.5 + p.x * 0.01 + p.depth) * p.sway * 0.5;
    
    // Wrap around edges
    if (p.x < -width/2 - p.size) p.x = width/2 + p.size;
    if (p.x > width/2 + p.size) p.x = -width/2 - p.size;
    if (p.y < -height/2 - p.size) p.y = height/2 + p.size;
    if (p.y > height/2 + p.size) p.y = -height/2 - p.size;
    
    // Add depth-based distortion
    let distortion = sin(time * 0.3 + p.x * 0.01) * 1;
    
    // Set particle color and size based on depth
    fill(p.hue, 70, 90, p.opacity);
    
    // Use vertex to draw particles as points
    vertex(p.x + distortion, p.y, p.z);
  }
  endShape();
  
  // Add periodic ripple effects
  if (frameCount % 30 === 0) {
    for (let i = 0; i < 2; i++) {
      let rippleX = random(-width/2, width/2);
      let rippleY = random(-height/2, height/2);
      let size = random(20, 80);
      
      fill(190, 40, 80, 0.1);
      ellipse(rippleX, rippleY, size, size * 0.3);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
