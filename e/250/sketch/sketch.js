let forms = [];
let shadows = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create initial luminous forms
  for (let i = 0; i < 20; i++) {
    forms.push({
      x: random(width),
      y: random(height),
      size: random(30, 100),
      hue: random(360),
      speed: random(0.005, 0.02),
      pulse: random(TWO_PI)
    });
  }
  
  // Initialize shadow particles
  for (let i = 0; i < 500; i++) {
    shadows.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      speed: random(0.001, 0.005),
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  background(0);
  
  time += 0.01;
  
  // Draw shadows first (behind forms)
  drawShadows();
  
  // Draw luminous forms
  drawForms();
}

function drawShadows() {
  beginShape(POINTS);
  for (let i = 0; i < shadows.length; i++) {
    let s = shadows[i];
    
    // Animate shadow particles
    s.phase += s.speed;
    s.x += sin(s.phase) * 0.5;
    s.y += cos(s.phase) * 0.5;
    
    // Wrap around canvas
    if (s.x < 0) s.x = width;
    if (s.x > width) s.x = 0;
    if (s.y < 0) s.y = height;
    if (s.y > height) s.y = 0;
    
    // Apply glow effect based on time and form proximity
    let glowIntensity = 0.5 + 0.5 * sin(time + s.phase);
    fill(240, 80, 100, glowIntensity * 0.3);
    vertex(s.x, s.y);
  }
  endShape();
}

function drawForms() {
  for (let i = 0; i < forms.length; i++) {
    let f = forms[i];
    
    // Animate form
    f.pulse += f.speed;
    let pulse = sin(f.pulse) * 0.5 + 0.5;
    
    // Adjust color based on interaction or time
    let hueShift = (time * 10 + i * 20) % 360;
    let formHue = (f.hue + hueShift) % 360;
    
    // Draw glow effect
    noStroke();
    fill(formHue, 80, 100, 0.7);
    ellipse(f.x, f.y, f.size * (1 + pulse * 0.5));
    
    // Draw inner core
    fill(formHue, 100, 100, 0.9);
    ellipse(f.x, f.y, f.size * 0.3 * (1 + pulse * 0.5));
    
    // Move form slowly
    f.x += sin(time * 0.2 + i) * 0.1;
    f.y += cos(time * 0.2 + i) * 0.1;
    
    // Wrap around canvas
    if (f.x < 0) f.x = width;
    if (f.x > width) f.x = 0;
    if (f.y < 0) f.y = height;
    if (f.y > height) f.y = 0;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
