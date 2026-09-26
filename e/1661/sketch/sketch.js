let forms = [];
let connections = [];
let colorShift = 0;
let pulse = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Initialize network of fluid forms
  for (let i = 0; i < 40; i++) {
    forms.push({
      x: random(width),
      y: random(height),
      size: random(25, 100),
      speed: random(0.2, 1.2),
      angle: random(TWO_PI),
      color: color(random(200, 255), random(100, 200), random(50, 150), 200),
      connections: [],
      burst: false,
      burstTimer: 0
    });
  }
}

function draw() {
  background(15);
  
  // Update pulse for color transitions
  pulse += 0.02;
  
  // Update and display forms
  for (let i = 0; i < forms.length; i++) {
    let form = forms[i];
    
    // Drift and change shape
    form.x += cos(form.angle) * form.speed;
    form.y += sin(form.angle) * form.speed;
    form.angle += random(-0.03, 0.03);
    form.size += sin(frameCount * 0.02 + i) * 0.8;
    
    // Add occasional bursts of energy
    if (frameCount % 120 === 0 && i % 3 === 0) {
      form.burst = true;
      form.burstTimer = 0;
    }
    
    if (form.burst) {
      form.burstTimer++;
      form.size *= 1.05;
      form.speed *= 1.02;
      
      if (form.burstTimer > 30) {
        form.burst = false;
      }
    }
    
    // Wrap around screen
    if (form.x < -50) form.x = width + 50;
    if (form.x > width + 50) form.x = -50;
    if (form.y < -50) form.y = height + 50;
    if (form.y > height + 50) form.y = -50;
    
    // Update color with more pronounced shifts
    let hue = (colorShift + i * 0.3) % 360;
    let sat = 80 + sin(pulse + i) * 20;
    let bri = 60 + sin(pulse * 2 + i) * 30;
    form.color = color(hue, sat, bri, 180);
    
    // Draw main form
    fill(form.color);
    ellipse(form.x, form.y, form.size);
  }
  
  // Draw connections between nearby forms with more vivid colors
  beginShape(LINES);
  let connectionCount = 0;
  for (let i = 0; i < forms.length; i++) {
    let form = forms[i];
    for (let j = i + 1; j < forms.length; j++) {
      if (connectionCount > 200) break; // Limit connections per frame
      
      let other = forms[j];
      let d = dist(form.x, form.y, other.x, other.y);
      
      if (d < 180) {
        // Use the color of the first form to determine line color
        stroke(red(form.color), green(form.color), blue(form.color), 80);
        vertex(form.x, form.y);
        vertex(other.x, other.y);
        connectionCount++;
      }
    }
  }
  endShape();
  
  colorShift += 0.02;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
