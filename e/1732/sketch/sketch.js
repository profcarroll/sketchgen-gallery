let forms = [];
let connections = [];
let colorShift = 0;
let pulse = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Initialize network of fluid forms
  for (let i = 0; i < 50; i++) {
    forms.push({
      x: random(width),
      y: random(height),
      size: random(30, 120),
      speed: random(0.3, 1.5),
      angle: random(TWO_PI),
      color: color(random(200, 255), random(100, 200), random(50, 150), 200),
      connections: [],
      burst: false,
      burstTimer: 0
    });
  }
}

function draw() {
  background(10);
  
  // Update pulse for color transitions
  pulse += 0.03;
  
  // Update and display forms
  for (let i = 0; i < forms.length; i++) {
    let form = forms[i];
    
    // Drift and change shape
    form.x += cos(form.angle) * form.speed;
    form.y += sin(form.angle) * form.speed;
    form.angle += random(-0.05, 0.05);
    form.size += sin(frameCount * 0.03 + i) * 1.2;
    
    // Add occasional bursts of energy
    if (frameCount % 90 === 0 && i % 4 === 0) {
      form.burst = true;
      form.burstTimer = 0;
    }
    
    if (form.burst) {
      form.burstTimer++;
      form.size *= 1.07;
      form.speed *= 1.03;
      
      if (form.burstTimer > 25) {
        form.burst = false;
      }
    }
    
    // Wrap around screen
    if (form.x < -50) form.x = width + 50;
    if (form.x > width + 50) form.x = -50;
    if (form.y < -50) form.y = height + 50;
    if (form.y > height + 50) form.y = -50;
    
    // Update color with more abrupt shifts
    let hue = (colorShift + i * 0.5) % 360;
    let sat = 90 + sin(pulse + i * 0.7) * 30;
    let bri = 70 + sin(pulse * 3 + i) * 40;
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
      if (connectionCount > 250) break; // Limit connections per frame
      
      let other = forms[j];
      let d = dist(form.x, form.y, other.x, other.y);
      
      if (d < 200) {
        // Use the color of the first form to determine line color
        stroke(red(form.color), green(form.color), blue(form.color), 90);
        vertex(form.x, form.y);
        vertex(other.x, other.y);
        connectionCount++;
      }
    }
  }
  endShape();
  
  colorShift += 0.03;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
