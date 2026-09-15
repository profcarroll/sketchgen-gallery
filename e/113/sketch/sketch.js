let shadows = [];
let lightSource;

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Initialize multiple shadow puppets
  for (let i = 0; i < 5; i++) {
    shadows.push({
      x: random(width),
      y: random(height),
      size: random(50, 120),
      hue: random(360),
      speed: random(0.5, 2),
      angle: random(TWO_PI),
      sway: random(0.02, 0.05)
    });
  }
  
  lightSource = { x: width / 2, y: height / 2 };
}

function draw() {
  // Dark background
  background(0, 0, 10);
  
  // Simulate ambient lighting
  fill(0, 0, 5, 0.1);
  rect(0, 0, width, height);
  
  // Move light source slightly for dynamic effect
  lightSource.x += sin(frameCount * 0.005) * 2;
  lightSource.y += cos(frameCount * 0.007) * 2;
  
  // Draw each shadow puppet
  for (let i = 0; i < shadows.length; i++) {
    let s = shadows[i];
    
    // Update position based on mouse interaction or natural motion
    if (mouseIsPressed) {
      s.x += (mouseX - pmouseX) * 0.1;
      s.y += (mouseY - pmouseY) * 0.1;
    } else {
      s.angle += s.sway;
      s.x += cos(s.angle) * s.speed;
      s.y += sin(s.angle) * s.speed;
    }
    
    // Keep puppets on screen
    if (s.x < -50 || s.x > width + 50 || s.y < -50 || s.y > height + 50) {
      s.x = random(width);
      s.y = random(height);
    }
    
    // Create shadow effect
    fill(s.hue, 80, 20, 0.7);
    noStroke();
    
    // Draw puppet silhouette with some stylized features
    push();
    translate(s.x, s.y);
    scale(s.size / 100);
    
    // Main body
    ellipse(0, 0, 100, 120);
    
    // Head and neck
    ellipse(0, -40, 50, 50);
    rect(-20, -60, 40, 20);
    
    // Arms
    ellipse(-40, 0, 20, 60);
    ellipse(40, 0, 20, 60);
    
    // Legs
    ellipse(-15, 60, 20, 50);
    ellipse(15, 60, 20, 50);
    
    pop();
    
    // Add subtle glow around puppet
    fill(s.hue, 80, 100, 0.1);
    ellipse(s.x, s.y, s.size * 1.5, s.size * 1.8);
  }
  
  // Draw light source effect
  fill(255, 255, 100, 0.3);
  noStroke();
  ellipse(lightSource.x, lightSource.y, 100, 100);
}

function mouseDragged() {
  // Allow dragging to influence all shadows
  for (let s of shadows) {
    let d = dist(s.x, s.y, mouseX, mouseY);
    if (d < 150) {
      let force = map(d, 0, 150, 2, 0);
      s.x += (s.x - mouseX) * force * 0.05;
      s.y += (s.y - mouseY) * force * 0.05;
    }
  }
}
