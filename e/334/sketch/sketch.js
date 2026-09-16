let forms = [];
let trails = [];
let bgBrightness = 0;
let bgTarget = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize bioluminescent forms
  for (let i = 0; i < 8; i++) {
    forms.push({
      x: random(width),
      y: random(height),
      size: random(30, 80),
      hue: random(360),
      speed: random(0.5, 2),
      pulse: random(TWO_PI),
      pulseSpeed: random(0.02, 0.05),
      trail: []
    });
  }
  
  // Initialize trails
  for (let i = 0; i < 100; i++) {
    trails.push({
      x: random(width),
      y: random(height),
      size: random(2, 8),
      opacity: random(0.3, 0.8),
      speed: random(0.5, 1.5)
    });
  }
}

function draw() {
  // Smoothly transition background brightness
  bgBrightness += (bgTarget - bgBrightness) * 0.02;
  
  // Create dynamic background effect
  if (frameCount % 60 === 0) {
    bgTarget = random(10, 30);
  }
  
  // Draw background with subtle gradient
  background(bgBrightness);
  
  // Update and draw forms
  for (let i = 0; i < forms.length; i++) {
    let form = forms[i];
    
    // Update position
    form.x += sin(frameCount * 0.001 + i) * form.speed;
    form.y += cos(frameCount * 0.001 + i) * form.speed;
    
    // Wrap around screen
    if (form.x < -50) form.x = width + 50;
    if (form.x > width + 50) form.x = -50;
    if (form.y < -50) form.y = height + 50;
    if (form.y > height + 50) form.y = -50;
    
    // Update pulse
    form.pulse += form.pulseSpeed;
    
    // Add to trail
    form.trail.push({x: form.x, y: form.y});
    if (form.trail.length > 20) {
      form.trail.shift();
    }
    
    // Draw trail with dynamic thickness and intensity
    noFill();
    stroke(form.hue, 100, 100, 0.3);
    strokeWeight(2);
    beginShape();
    for (let j = 0; j < form.trail.length; j++) {
      let alpha = map(j, 0, form.trail.length, 0, 0.5);
      stroke(form.hue, 100, 100, alpha);
      vertex(form.trail[j].x, form.trail[j].y);
    }
    endShape();
    
    // Draw glowing form
    let pulseSize = sin(form.pulse) * 5 + form.size;
    fill(form.hue, 100, 100, 0.7);
    noStroke();
    ellipse(form.x, form.y, pulseSize, pulseSize);
    
    // Add glow effect
    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = color(form.hue, 100, 100, 0.8);
    ellipse(form.x, form.y, pulseSize * 1.5, pulseSize * 1.5);
    drawingContext.shadowBlur = 0;
  }
  
  // Update and draw trails
  for (let i = 0; i < trails.length; i++) {
    let trail = trails[i];
    
    // Update position
    trail.x += sin(frameCount * 0.002 + i) * trail.speed;
    trail.y += cos(frameCount * 0.002 + i) * trail.speed;
    
    // Wrap around screen
    if (trail.x < -20) trail.x = width + 20;
    if (trail.x > width + 20) trail.x = -20;
    if (trail.y < -20) trail.y = height + 20;
    if (trail.y > height + 20) trail.y = -20;
    
    // Draw trail
    noStroke();
    fill(200, 50, 80, trail.opacity);
    ellipse(trail.x, trail.y, trail.size, trail.size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
