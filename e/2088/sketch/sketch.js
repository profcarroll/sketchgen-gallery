let forms = [];
let colorShift = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Initialize network of fluid forms
  for (let i = 0; i < 80; i++) {
    forms.push({
      x: random(width),
      y: random(height),
      size: random(30, 120),
      speed: random(0.1, 0.5),
      angle: random(TWO_PI),
      color: color(random(200, 255), random(100, 200), random(50, 150), 180),
      connections: []
    });
  }
}

function draw() {
  background(10);
  
  // Update and display forms
  for (let i = 0; i < forms.length; i++) {
    let form = forms[i];
    
    // Gentle drift and shape change
    form.x += cos(form.angle) * form.speed;
    form.y += sin(form.angle) * form.speed;
    form.angle += random(-0.02, 0.02);
    form.size += sin(frameCount * 0.02 + i) * 0.5;
    
    // Wrap around screen
    if (form.x < -50) form.x = width + 50;
    if (form.x > width + 50) form.x = -50;
    if (form.y < -50) form.y = height + 50;
    if (form.y > height + 50) form.y = -50;
    
    // Subtle color shift with near-monochromatic palette
    let hue = (colorShift + i * 0.3) % 360;
    let sat = 80 + sin(frameCount * 0.01 + i * 0.5) * 20;
    let bri = 60 + sin(frameCount * 0.005 + i) * 20;
    form.color = color(hue, sat, bri, 150);
    
    // Draw main form
    fill(form.color);
    ellipse(form.x, form.y, form.size);
  }
  
  // Draw connections between nearby forms with subtle colors
  beginShape(LINES);
  let connectionCount = 0;
  for (let i = 0; i < forms.length; i++) {
    let form = forms[i];
    for (let j = i + 1; j < forms.length; j++) {
      if (connectionCount > 200) break; // Limit connections per frame
      
      let other = forms[j];
      let d = dist(form.x, form.y, other.x, other.y);
      
      if (d < 150) {
        // Use the color of the first form to determine line color
        stroke(red(form.color), green(form.color), blue(form.color), 30);
        vertex(form.x, form.y);
        vertex(other.x, other.y);
        connectionCount++;
      }
    }
  }
  endShape();
  
  colorShift += 0.01;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
