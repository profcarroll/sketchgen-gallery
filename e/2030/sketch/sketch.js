let colors = [];
let particles = [];
const numParticles = 1000;
const colorPool = [
  [255, 50, 50],   // Red
  [50, 255, 50],   // Green
  [50, 50, 255],   // Blue
  [255, 255, 50],  // Yellow
  [255, 50, 255],  // Magenta
  [50, 255, 255]   // Cyan
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Initialize color pools
  for (let i = 0; i < 10; i++) {
    colors.push({
      r: random(50, 255),
      g: random(50, 255),
      b: random(50, 255),
      x: random(width),
      y: random(height),
      size: random(100, 300),
      speed: random(0.001, 0.005)
    });
  }
  
  // Initialize particles
  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      size: random(2, 8),
      color: random(colorPool),
      speed: random(0.5, 2),
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  // Semi-transparent background for trail effect
  background(0, 10);
  
  // Update and display color pools
  for (let i = 0; i < colors.length; i++) {
    const c = colors[i];
    
    // Slowly move the pool centers
    c.x += sin(frameCount * c.speed) * 0.5;
    c.y += cos(frameCount * c.speed) * 0.5;
    
    // Draw a soft gradient circle for each pool
    drawingContext.globalCompositeOperation = 'screen';
    const gradient = drawingContext.createRadialGradient(
      c.x, c.y, 0,
      c.x, c.y, c.size
    );
    gradient.addColorStop(0, `rgba(${c.r}, ${c.g}, ${c.b}, 0.8)`);
    gradient.addColorStop(1, `rgba(${c.r}, ${c.g}, ${c.b}, 0)`);
    
    drawingContext.fillStyle = gradient;
    ellipse(c.x, c.y, c.size * 2);
  }
  
  // Update and display particles
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    
    // Slow movement with noise-based trajectory
    const angle = noise(p.x * 0.001, p.y * 0.001, frameCount * 0.001) * TWO_PI;
    p.x += cos(angle) * p.speed;
    p.y += sin(angle) * p.speed;
    
    // Wrap around edges
    if (p.x < -50) p.x = width + 50;
    if (p.x > width + 50) p.x = -50;
    if (p.y < -50) p.y = height + 50;
    if (p.y > height + 50) p.y = -50;
    
    // Draw particle
    fill(p.color[0], p.color[1], p.color[2], 150);
    ellipse(p.x, p.y, p.size);
  }
  
  drawingContext.globalCompositeOperation = 'source-over';
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
