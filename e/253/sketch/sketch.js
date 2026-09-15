let forms = [];
let trails = [];
let numForms = 100;
let numTrails = 500;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize bioluminescent forms
  for (let i = 0; i < numForms; i++) {
    forms.push({
      x: random(width),
      y: random(height),
      size: random(5, 20),
      speed: random(0.5, 2),
      hue: random(360),
      angle: random(TWO_PI),
      trail: []
    });
  }
  
  // Initialize trails
  for (let i = 0; i < numTrails; i++) {
    trails.push({
      x: random(width),
      y: random(height),
      size: random(1, 5),
      alpha: random(50, 100),
      life: random(100, 200)
    });
  }
}

function draw() {
  background(0, 0, 0, 0.05); // Semi-transparent black for trail fading
  
  // Update and display forms
  for (let i = 0; i < forms.length; i++) {
    let form = forms[i];
    
    // Update position with gentle random movement
    form.angle += random(-0.05, 0.05);
    form.x += cos(form.angle) * form.speed;
    form.y += sin(form.angle) * form.speed;
    
    // Wrap around screen edges
    if (form.x < -50) form.x = width + 50;
    if (form.x > width + 50) form.x = -50;
    if (form.y < -50) form.y = height + 50;
    if (form.y > height + 50) form.y = -50;
    
    // Add current position to trail
    form.trail.push({x: form.x, y: form.y});
    if (form.trail.length > 20) {
      form.trail.shift();
    }
    
    // Draw trail
    noFill();
    stroke(form.hue, 100, 100, 0.3);
    strokeWeight(1);
    beginShape();
    for (let pos of form.trail) {
      vertex(pos.x, pos.y);
    }
    endShape();
    
    // Draw bioluminescent form
    noStroke();
    fill(form.hue, 100, 100, 0.8);
    ellipse(form.x, form.y, form.size);
    
    // Add glow effect
    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = color(form.hue, 100, 100);
    ellipse(form.x, form.y, form.size * 1.5);
    drawingContext.shadowBlur = 0;
    
    // Update hue for color cycling
    form.hue = (form.hue + 0.5) % 360;
  }
  
  // Update and display trails
  for (let i = 0; i < trails.length; i++) {
    let trail = trails[i];
    
    // Slowly decrease life
    trail.life -= 0.5;
    
    // Reset if dead
    if (trail.life <= 0) {
      trail.x = random(width);
      trail.y = random(height);
      trail.life = random(100, 200);
      trail.alpha = random(50, 100);
    }
    
    // Draw trail particle
    noStroke();
    fill(200, 50, 100, trail.alpha / 255);
    ellipse(trail.x, trail.y, trail.size);
    
    // Slight movement for particles
    trail.x += random(-0.5, 0.5);
    trail.y += random(-0.5, 0.5);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
