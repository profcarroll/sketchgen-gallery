let particles = [];
let waterColor1, waterColor2;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Create background gradient
  waterColor1 = color(190, 40, 25);
  waterColor2 = color(210, 50, 35);
  
  // Initialize particles
  for (let i = 0; i < 800; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      size: random(2, 15),
      speed: random(0.02, 0.15),
      angle: random(TWO_PI),
      hue: random(180, 240),
      opacity: random(0.03, 0.15),
      sway: random(0.003, 0.01),
      depth: random(1),
      shapeType: floor(random(3)) // 0: ellipse, 1: rect, 2: triangle
    });
  }
}

function draw() {
  // Draw gradient background
  for (let y = 0; y < height; y += 2) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(waterColor1, waterColor2, inter);
    stroke(c);
    line(0, y, width, y);
  }
  
  time += 0.003;
  
  // Update and draw particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Slow drift movement
    p.x += cos(p.angle) * p.speed;
    p.y += sin(p.angle) * p.speed;
    
    // Add gentle sway and depth effect
    p.x += sin(time + p.y * 0.01 + p.depth) * p.sway;
    p.y += cos(time * 0.5 + p.x * 0.01 + p.depth) * p.sway * 0.5;
    
    // Wrap around edges
    if (p.x < -p.size) p.x = width + p.size;
    if (p.x > width + p.size) p.x = -p.size;
    if (p.y < -p.size) p.y = height + p.size;
    if (p.y > height + p.size) p.y = -p.size;
    
    // Add depth-based distortion
    let distortion = sin(time * 0.3 + p.x * 0.01) * 2;
    let sizeVariation = map(p.depth, 0, 1, 0.8, 1.2);
    
    // Draw particle with semi-transparent fill
    fill(p.hue, 70, 90, p.opacity);
    
    push();
    translate(p.x + distortion, p.y);
    
    if (p.shapeType === 0) {
      ellipse(0, 0, p.size * sizeVariation, p.size * sizeVariation * 0.7);
    } else if (p.shapeType === 1) {
      rectMode(CENTER);
      rect(0, 0, p.size * sizeVariation, p.size * sizeVariation * 0.7);
    } else {
      triangle(
        0, -p.size * sizeVariation * 0.5,
        -p.size * sizeVariation * 0.5, p.size * sizeVariation * 0.5,
        p.size * sizeVariation * 0.5, p.size * sizeVariation * 0.5
      );
    }
    
    pop();
    
    // Add highlight for organic feel
    fill(255, 80, 100, 0.2);
    if (p.shapeType === 0) {
      ellipse(p.x + distortion - p.size * 0.2, p.y - p.size * 0.2, p.size * 0.2, p.size * 0.2);
    } else if (p.shapeType === 1) {
      rectMode(CENTER);
      rect(p.x + distortion - p.size * 0.2, p.y - p.size * 0.2, p.size * 0.2, p.size * 0.2);
    } else {
      triangle(
        p.x + distortion - p.size * 0.2, p.y - p.size * 0.2,
        p.x + distortion - p.size * 0.3, p.y - p.size * 0.1,
        p.x + distortion - p.size * 0.1, p.y - p.size * 0.1
      );
    }
  }
  
  // Add subtle ripples periodically
  if (frameCount % 25 === 0) {
    for (let i = 0; i < 3; i++) {
      let rippleX = random(width);
      let rippleY = random(height);
      let size = random(30, 120);
      
      fill(190, 40, 80, 0.08);
      ellipse(rippleX, rippleY, size, size * 0.3);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
