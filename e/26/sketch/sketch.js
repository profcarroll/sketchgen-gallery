let forms = [];
let colors = [];

function setup() {
  createCanvas(800, 600);
  noStroke();
  
  // Initialize forms with varying properties
  for (let i = 0; i < 20; i++) {
    forms.push({
      x: random(width),
      y: random(height),
      size: random(20, 100),
      speedX: random(-0.5, 0.5),
      speedY: random(-0.5, 0.5),
      phase: random(TWO_PI),
      mode: floor(random(2)),
      color: color(random(100, 255), random(100, 255), random(100, 255))
    });
  }
  
  // Precompute some color transitions
  for (let i = 0; i < 30; i++) {
    colors.push(color(
      sin(i * 0.2) * 100 + 155,
      cos(i * 0.3) * 100 + 155,
      tan(i * 0.1) * 100 + 155
    ));
  }
}

function draw() {
  background(10, 10, 20);
  
  // Update and display each form
  for (let i = 0; i < forms.length; i++) {
    let f = forms[i];
    
    // Apply motion based on mode
    if (f.mode === 0) {
      // Smooth idle movement
      f.x += f.speedX;
      f.y += f.speedY;
      f.phase += 0.02;
      
      // Boundary checks with bounce
      if (f.x < 0 || f.x > width) f.speedX *= -1;
      if (f.y < 0 || f.y > height) f.speedY *= -1;
    } else {
      // Sharp oscillation mode
      f.x += sin(f.phase) * 3;
      f.y += cos(f.phase) * 3;
      f.phase += 0.1;
    }
    
    // Size modulation based on phase
    let size = f.size + sin(f.phase * 2) * 10;
    
    // Color blending
    let cIndex = (frameCount + i) % colors.length;
    fill(colors[cIndex]);
    
    // Draw shape depending on mode
    if (f.mode === 0) {
      ellipse(f.x, f.y, size);
    } else {
      push();
      translate(f.x, f.y);
      rotate(f.phase);
      rect(0, 0, size, size * 0.5);
      pop();
    }
    
    // Occasionally switch modes
    if (frameCount % 100 === 0) {
      f.mode = 1 - f.mode;
    }
  }
}
