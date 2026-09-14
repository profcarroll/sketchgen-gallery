let forms = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Initialize forms with random properties
  for (let i = 0; i < 15; i++) {
    forms.push({
      x: random(width),
      y: random(height),
      size: random(20, 100),
      speed: random(0.01, 0.05),
      angle: random(TWO_PI),
      color: color(random(100, 255), random(100, 255), random(100, 255), 180),
      shape: floor(random(3)) // 0: circle, 1: rect, 2: ellipse
    });
  }
}

function draw() {
  background(10, 10, 20);
  
  time += 0.01;
  
  for (let form of forms) {
    // Oscillating movement and size changes
    let oscillation = sin(time * form.speed * 3) * 0.5 + 0.5;
    let morph = cos(time * form.speed * 2) * 0.5 + 0.5;
    
    // Update position with continuous motion
    form.x += sin(time * form.speed) * 0.5;
    form.y += cos(time * form.speed) * 0.5;
    
    // Wrap around screen edges
    if (form.x > width + 50) form.x = -50;
    if (form.x < -50) form.x = width + 50;
    if (form.y > height + 50) form.y = -50;
    if (form.y < -50) form.y = height + 50;
    
    // Color shift over time
    let hue = (frameCount * 0.3 + time * 10) % 360;
    form.color = color(hue, 80, 90, 180);
    
    push();
    translate(form.x, form.y);
    rotate(time * form.speed);
    
    // Draw the shape with morphing properties
    noStroke();
    fill(form.color);
    
    if (form.shape === 0) {
      ellipse(0, 0, form.size * oscillation, form.size * (1 - oscillation));
    } else if (form.shape === 1) {
      rectMode(CENTER);
      rect(0, 0, form.size * morph, form.size * (1 - morph));
    } else {
      ellipse(0, 0, form.size * (1 + morph), form.size * (1 - morph));
    }
    
    pop();
    
    // Connect forms with lines
    for (let other of forms) {
      let d = dist(form.x, form.y, other.x, other.y);
      if (d < 200 && d > 10) {
        stroke(255, 30);
        line(form.x, form.y, other.x, other.y);
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
