let fragments = [];
let shapes = [];
let textPool = [
  "thought", "stream", "consciousness", "flow", "liquid", "morph",
  "fragment", "shape", "melt", "form", "dissolve", "gather",
  "scatter", "illuminate", "dissipate", "trajectory", "narrative",
  "chaos", "order", "thinking", "mind", "perception", "reality"
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Initialize fragments
  for (let i = 0; i < 200; i++) {
    fragments.push({
      x: random(width),
      y: random(height),
      text: random(textPool),
      size: random(8, 24),
      vx: random(-1, 1),
      vy: random(-1, 1),
      alpha: random(50, 200),
      life: random(100, 300)
    });
  }
  
  // Initialize shapes
  for (let i = 0; i < 50; i++) {
    shapes.push({
      x: random(width),
      y: random(height),
      size: random(20, 100),
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5),
      alpha: random(30, 80),
      life: random(200, 600)
    });
  }
}

function draw() {
  background(245);
  
  // Update and display fragments
  for (let i = fragments.length - 1; i >= 0; i--) {
    let f = fragments[i];
    
    // Apply movement
    f.x += f.vx;
    f.y += f.vy;
    
    // Boundary check
    if (f.x < 0 || f.x > width) f.vx *= -1;
    if (f.y < 0 || f.y > height) f.vy *= -1;
    
    // Fade out over time
    f.life--;
    if (f.life <= 0) {
      fragments.splice(i, 1);
      // Add new fragment
      fragments.push({
        x: random(width),
        y: random(height),
        text: random(textPool),
        size: random(8, 24),
        vx: random(-1, 1),
        vy: random(-11, 1),
        alpha: random(50, 200),
        life: random(100, 300)
      });
    } else {
      fill(30, 30, 40, f.alpha);
      textSize(f.size);
      textAlign(CENTER, CENTER);
      text(f.text, f.x, f.y);
    }
  }
  
  // Update and display shapes
  for (let i = shapes.length - 1; i >= 0; i--) {
    let s = shapes[i];
    
    // Apply movement
    s.x += s.vx;
    s.y += s.vy;
    
    // Boundary check
    if (s.x < 0 || s.x > width) s.vx *= -1;
    if (s.y < 0 || s.y > height) s.vy *= -1;
    
    // Fade out over time
    s.life--;
    if (s.life <= 0) {
      shapes.splice(i, 1);
      // Add new shape
      shapes.push({
        x: random(width),
        y: random(height),
        size: random(20, 100),
        vx: random(-0.5, 0.5),
        vy: random(-0.5, 0.5),
        alpha: random(30, 80),
        life: random(200, 600)
      });
    } else {
      fill(180, 190, 200, s.alpha);
      ellipse(s.x, s.y, s.size, s.size);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
