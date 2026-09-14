let time = 0;
let forms = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Initialize complex interconnected forms
  for (let i = 0; i < 20; i++) {
    forms.push({
      x: random(width),
      y: random(height),
      size: random(50, 200),
      speed: random(0.01, 0.05),
      angle: random(TWO_PI),
      color: [random(255), random(255), random(255)],
      connections: []
    });
  }
  
  // Create connections between forms
  for (let i = 0; i < forms.length; i++) {
    for (let j = i + 1; j < forms.length; j++) {
      if (random() > 0.7) {
        forms[i].connections.push(j);
      }
    }
  }
}

function draw() {
  background(10, 5, 20);
  
  time += 0.02;
  
  // Update and display all forms
  for (let i = 0; i < forms.length; i++) {
    let form = forms[i];
    
    // Apply complex oscillating movement
    form.x += sin(time * form.speed + form.angle) * 2;
    form.y += cos(time * form.speed * 1.3 + form.angle) * 2;
    form.size += sin(time * 2 + i) * 0.5;
    
    // Keep forms within canvas
    if (form.x < 0 || form.x > width) form.angle += PI;
    if (form.y < 0 || form.y > height) form.angle += PI;
    
    // Color modulation based on position and time
    let hue = (time * 20 + i * 10) % 360;
    let sat = 80 + sin(time + i) * 20;
    let bright = 70 + cos(time * 0.5 + i) * 30;
    
    fill(hue, sat, bright, 180);
    
    // Draw main form with dynamic shape
    push();
    translate(form.x, form.y);
    rotate(time * form.speed);
    
    let sides = 3 + floor(sin(time * 0.5 + i) * 2);
    let size = form.size * (0.8 + sin(time * 3 + i) * 0.2);
    
    beginShape();
    for (let a = 0; a < TWO_PI; a += TWO_PI / sides) {
      let x = cos(a) * size;
      let y = sin(a) * size;
      // Add complex deformation
      x += sin(time * 4 + a * 3) * size * 0.3;
      y += cos(time * 3 + a * 2) * size * 0.3;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    pop();
    
    // Draw connections between forms
    fill(255, 100);
    for (let j = 0; j < form.connections.length; j++) {
      let other = forms[form.connections[j]];
      if (other) {
        let d = dist(form.x, form.y, other.x, other.y);
        if (d < 300) {
          stroke(hue, sat, bright, map(d, 0, 300, 255, 30));
          strokeWeight(map(d, 0, 300, 2, 0.5));
          line(form.x, form.y, other.x, other.y);
        }
      }
    }
  }
  
  // Add floating particles for extra fluidity
  for (let i = 0; i < 50; i++) {
    let x = (time * 20 + i * 10) % width;
    let y = sin(time * 0.5 + i) * 100 + height / 2;
    let size = sin(time * 3 + i) * 2 + 2;
    
    fill(255, 150);
    noStroke();
    ellipse(x, y, size, size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
