let forms = [];
let hueShift = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Create a grid of abstract floral forms
  for (let i = 0; i < 150; i++) {
    forms.push({
      x: random(width),
      y: random(height),
      size: random(20, 80),
      hue: random(10, 40), // Jewel tones and pastels
      saturation: random(70, 100),
      brightness: random(60, 95),
      angle: random(TWO_PI),
      speed: random(0.002, 0.008),
      sway: random(0.01, 0.03)
    });
  }
}

function draw() {
  // Soft background with slight fade
  fill(255, 255, 255, 10);
  rect(0, 0, width, height);
  
  hueShift += 0.1;
  
  for (let i = 0; i < forms.length; i++) {
    let f = forms[i];
    
    // Update form position with subtle animation
    f.x += sin(frameCount * f.speed + f.angle) * 0.5;
    f.y += cos(frameCount * f.speed + f.angle) * 0.3;
    f.angle += f.sway;
    
    // Apply hue shift to create color bleeding effect
    let h = (f.hue + hueShift) % 360;
    
    // Create gradient fill with soft edges
    let c = color(h, f.saturation, f.brightness);
    fill(c);
    
    // Draw abstract floral shape using multiple overlapping ellipses
    push();
    translate(f.x, f.y);
    rotate(frameCount * 0.01 + i * 0.2);
    
    // Main petal
    ellipse(0, 0, f.size, f.size * 0.6);
    
    // Secondary petals
    for (let j = 0; j < 5; j++) {
      let angle = TWO_PI * j / 5;
      let x = cos(angle) * f.size * 0.3;
      let y = sin(angle) * f.size * 0.3;
      ellipse(x, y, f.size * 0.4, f.size * 0.2);
    }
    
    // Central core
    fill(h + 20, f.saturation - 10, f.brightness - 20);
    ellipse(0, 0, f.size * 0.3, f.size * 0.3);
    
    pop();
  }
  
  // Occasionally create new forms to simulate growth
  if (frameCount % 100 === 0 && forms.length < 250) {
    forms.push({
      x: random(width),
      y: random(height),
      size: random(20, 80),
      hue: random(10, 40),
      saturation: random(70, 100),
      brightness: random(60, 95),
      angle: random(TWO_PI),
      speed: random(0.002, 0.008),
      sway: random(0.01, 0.03)
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
