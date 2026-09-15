let forms = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Initialize forms with random properties
  for (let i = 0; i < 15; i++) {
    forms.push({
      x: random(width),
      y: random(height),
      size: random(20, 80),
      speed: random(0.01, 0.03),
      phase: random(TWO_PI),
      color: color(random(100, 255), random(100, 255), random(100, 255), 180),
    });
  }
}

function draw() {
  background(10);
  time += 0.02;

  // Draw connections between forms
  beginShape(LINES);
  stroke(255, 50);
  noFill();
  for (let i = 0; i < forms.length; i++) {
    for (let j = i + 1; j < forms.length; j++) {
      let d = dist(forms[i].x, forms[i].y, forms[j].x, forms[j].y);
      if (d < 200) {
        vertex(forms[i].x, forms[i].y);
        vertex(forms[j].x, forms[j].y);
      }
    }
  }
  endShape();

  // Update and draw each form
  for (let i = 0; i < forms.length; i++) {
    let f = forms[i];
    
    // Oscillatory movement with sharp wave pattern
    let oscillation = sin(time * f.speed + f.phase) * 0.5 + 0.5;
    let wave = sin(time * f.speed * 2 + f.phase) * 0.3 + 0.7;
    
    // Morph size and position
    f.size = 20 + sin(time * f.speed + f.phase) * 30;
    f.x += cos(time * f.speed + f.phase) * 0.5;
    f.y += sin(time * f.speed + f.phase) * 0.5;
    
    // Wrap around screen
    if (f.x > width + 50) f.x = -50;
    if (f.x < -50) f.x = width + 50;
    if (f.y > height + 50) f.y = -50;
    if (f.y < -50) f.y = height + 50;
    
    // Apply color shift
    let hue = (time * 20 + i * 30) % 360;
    f.color = color(hue, 100, 200, 180);
    
    // Draw form with morphing shape
    push();
    translate(f.x, f.y);
    rotate(time * f.speed + f.phase);
    fill(f.color);
    noStroke();
    
    if (frameCount % 20 < 10) {
      ellipse(0, 0, f.size, f.size * wave);
    } else {
      rectMode(CENTER);
      rect(0, 0, f.size * wave, f.size);
    }
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
