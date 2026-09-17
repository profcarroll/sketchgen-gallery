let forms = [];
let tails = [];
let colors = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create bioluminescent forms
  for (let i = 0; i < 20; i++) {
    forms.push({
      x: random(width),
      y: random(height),
      size: random(20, 60),
      speed: random(0.5, 2),
      direction: random(TWO_PI),
      pulse: random(100),
      color: color(random(200, 280), 80, 90, 0.8),
      tail: []
    });
  }
  
  // Initialize colors for smooth transitions
  for (let i = 0; i < 360; i += 5) {
    colors.push(color(i, 80, 90, 0.8));
  }
}

function draw() {
  background(0);
  
  // Update and draw forms
  for (let i = 0; i < forms.length; i++) {
    let form = forms[i];
    
    // Drift motion
    form.x += cos(form.direction) * form.speed;
    form.y += sin(form.direction) * form.speed;
    
    // Boundary check and bounce
    if (form.x < 0 || form.x > width) form.direction = PI - form.direction;
    if (form.y < 0 || form.y > height) form.direction = -form.direction;
    
    // Pulsing effect
    form.pulse += 0.03;
    let pulseSize = sin(form.pulse) * 5 + form.size;
    
    // Draw bioluminescent form
    noStroke();
    fill(form.color);
    ellipse(form.x, form.y, pulseSize);
    
    // Create glow effect
    fill(form.color);
    noStroke();
    for (let j = 0; j < 3; j++) {
      let alpha = map(j, 0, 2, 0.1, 0.02);
      fill(hue(form.color), saturation(form.color), brightness(form.color), alpha);
      ellipse(form.x, form.y, pulseSize + j * 10);
    }
    
    // Update tail
    form.tail.push({x: form.x, y: form.y});
    if (form.tail.length > 30) {
      form.tail.shift();
    }
    
    // Draw tail with ripples
    if (form.tail.length > 5) {
      stroke(form.color);
      strokeWeight(1);
      noFill();
      
      beginShape();
      for (let j = 0; j < form.tail.length; j++) {
        let point = form.tail[j];
        let ripple = sin(frameCount * 0.05 + j * 0.2) * 3;
        vertex(point.x + ripple, point.y + ripple);
      }
      endShape();
      
      // Draw ripples
      for (let j = 0; j < form.tail.length; j += 5) {
        let point = form.tail[j];
        let size = sin(frameCount * 0.1 + j * 0.2) * 3;
        noFill();
        stroke(form.color);
        strokeWeight(0.5);
        ellipse(point.x, point.y, size);
      }
    }
    
    // Check for interactions with other forms
    for (let j = 0; j < forms.length; j++) {
      if (i !== j) {
        let otherForm = forms[j];
        let d = dist(form.x, form.y, otherForm.x, otherForm.y);
        
        if (d < 150) {
          // Draw connecting lines when forms are close
          stroke(form.color);
          strokeWeight(0.2);
          line(form.x, form.y, otherForm.x, otherForm.y);
          
          // Create bridge effect when forms get very close
          if (d < 50) {
            let bridgeColor = lerpColor(form.color, otherForm.color, 0.5);
            stroke(bridgeColor);
            strokeWeight(2);
            line(form.x, form.y, otherForm.x, otherForm.y);
          }
        }
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
