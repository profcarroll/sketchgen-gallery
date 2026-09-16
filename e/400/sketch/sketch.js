let forms = [];
let hueOffset = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 100);
  noStroke();
  
  // Initialize network of geometric forms
  for (let i = 0; i < 20; i++) {
    forms.push({
      x: random(width),
      y: random(height),
      size: random(30, 150),
      speed: random(0.01, 0.05),
      angle: random(TWO_PI),
      shapeType: floor(random(3)), // 0: circle, 1: rect, 2: triangle
      hue: random(100)
    });
  }
}

function draw() {
  background(0, 0, 0, 0.05); // Semi-transparent background for trail effect
  
  hueOffset += 0.3;
  
  // Update and display forms
  for (let i = 0; i < forms.length; i++) {
    let form = forms[i];
    
    // Oscillate position
    form.x += cos(form.angle) * form.speed * 10;
    form.y += sin(form.angle) * form.speed * 10;
    form.angle += 0.02;
    
    // Keep within canvas bounds
    if (form.x < 0 || form.x > width) form.angle = PI - form.angle;
    if (form.y < 0 || form.y > height) form.angle = -form.angle;
    
    // Morph size and color
    form.size += sin(frameCount * 0.02 + i) * 0.5;
    form.hue = (form.hue + 0.5) % 100;
    
    // Draw form with dynamic color
    fill((form.hue + hueOffset) % 100, 90, 90, 80);
    
    push();
    translate(form.x, form.y);
    
    if (form.shapeType === 0) {
      ellipse(0, 0, form.size);
    } else if (form.shapeType === 1) {
      rectMode(CENTER);
      rect(0, 0, form.size, form.size);
    } else {
      triangle(
        0, -form.size/2,
        form.size/2, form.size/2,
        -form.size/2, form.size/2
      );
    }
    
    pop();
  }
  
  // Connect nearby forms with lines
  for (let i = 0; i < forms.length; i++) {
    for (let j = i + 1; j < forms.length; j++) {
      let d = dist(forms[i].x, forms[i].y, forms[j].x, forms[j].y);
      if (d < 200) {
        stroke((hueOffset + i * 5 + j * 3) % 100, 80, 80, 30);
        line(forms[i].x, forms[i].y, forms[j].x, forms[j].y);
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
