let forms = [];
let connections = [];
let colorShift = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Initialize network of fluid forms
  for (let i = 0; i < 30; i++) {
    forms.push({
      x: random(width),
      y: random(height),
      size: random(20, 80),
      speed: random(0.3, 1.5),
      angle: random(TWO_PI),
      color: color(random(100, 255), random(100, 255), random(100, 255), 180),
      connections: []
    });
  }
}

function draw() {
  background(10);
  
  // Update and display forms
  for (let i = 0; i < forms.length; i++) {
    let form = forms[i];
    
    // Drift and change shape
    form.x += cos(form.angle) * form.speed;
    form.y += sin(form.angle) * form.speed;
    form.angle += random(-0.02, 0.02);
    form.size += sin(frameCount * 0.03 + i) * 0.5;
    
    // Wrap around screen
    if (form.x < -50) form.x = width + 50;
    if (form.x > width + 50) form.x = -50;
    if (form.y < -50) form.y = height + 50;
    if (form.y > height + 50) form.y = -50;
    
    // Update color
    colorShift += 0.01;
    let r = sin(colorShift + i) * 127 + 128;
    let g = sin(colorShift + i + TWO_PI/3) * 127 + 128;
    let b = sin(colorShift + i + TWO_PI/3 * 2) * 127 + 128;
    form.color = color(r, g, b, 180);
    
    // Draw main form
    fill(form.color);
    ellipse(form.x, form.y, form.size);
  }
  
  // Draw connections between nearby forms
  beginShape(LINES);
  for (let i = 0; i < forms.length; i++) {
    let form = forms[i];
    for (let j = i + 1; j < forms.length; j++) {
      let other = forms[j];
      let d = dist(form.x, form.y, other.x, other.y);
      
      if (d < 150) {
        // Use the color of the first form to determine line color
        stroke(red(form.color), green(form.color), blue(form.color), 60);
        vertex(form.x, form.y);
        vertex(other.x, other.y);
      }
    }
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
