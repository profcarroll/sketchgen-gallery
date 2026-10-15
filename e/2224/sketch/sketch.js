let zoom = 1;
let offsetX = 0;
let offsetY = 0;
let isDragging = false;
let lastMouseX, lastMouseY;
let particles = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 1);
  
  // Initialize particles for the vascular network
  for (let i = 0; i < 1500; i++) {
    particles.push({
      x: random(-1, 1),
      y: random(-1, 1),
      age: random(100),
      hue: random(0.02, 0.08), // Crimson to pink range
      saturation: random(0.7, 1),
      brightness: random(0.4, 0.9)
    });
  }
}

function draw() {
  background(0);
  
  // Continuous zoom and pan
  time += 0.002;
  zoom *= 1.0005;
  
  // Slowly shift the view to simulate deepening into the fractal
  offsetX += sin(time * 0.3) * 0.0001;
  offsetY += cos(time * 0.2) * 0.0001;
  
  // Draw the vascular network
  strokeWeight(0.5);
  beginShape(LINES);
  
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    
    // Animate the particles
    p.age += 0.5;
    p.x += sin(p.age * 0.02) * 0.0001;
    p.y += cos(p.age * 0.02) * 0.0001;
    
    // Map particle to screen coordinates
    const scale = zoom * 4 / min(width, height);
    const screenX = (p.x - offsetX) / scale + width/2;
    const screenY = (p.y - offsetY) / scale + height/2;
    
    if (i > 0) {
      const prev = particles[i-1];
      const prevX = (prev.x - offsetX) / scale + width/2;
      const prevY = (prev.y - offsetY) / scale + height/2;
      
      // Only draw connections that are close enough
      const dx = screenX - prevX;
      const dy = screenY - prevY;
      if (dx*dx + dy*dy < 10000) { // ~100px squared
        stroke(p.hue, p.saturation, p.brightness);
        vertex(prevX, prevY);
        vertex(screenX, screenY);
      }
    }
    
    // Draw the particle itself
    if (i % 50 === 0) { // Only draw every 50th particle as a point
      stroke(p.hue, p.saturation, p.brightness);
      point(screenX, screenY);
    }
  }
  
  endShape();
  
  // Draw some glowing structures in the background
  for (let i = 0; i < 100; i++) {
    const angle = time + i * 0.1;
    const radius = 50 + sin(time * 0.5 + i) * 20;
    const x = width/2 + cos(angle) * radius;
    const y = height/2 + sin(angle) * radius;
    
    // Draw pulsing glow
    const pulse = sin(time * 3 + i) * 0.5 + 0.5;
    fill(0.02, 0.8, 0.6, 0.1 * pulse);
    noStroke();
    ellipse(x, y, 10 * pulse, 10 * pulse);
  }
}

function mousePressed() {
  if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) {
    isDragging = true;
    lastMouseX = mouseX;
    lastMouseY = mouseY;
  }
}

function mouseDragged() {
  if (isDragging) {
    offsetX -= (mouseX - lastMouseX) * zoom * 4 / min(width, height);
    offsetY -= (mouseY - lastMouseY) * zoom * 4 / min(width, height);
    lastMouseX = mouseX;
    lastMouseY = mouseY;
    redraw();
  }
}

function mouseReleased() {
  isDragging = false;
}

function mouseClicked() {
  // Zoom in on click
  zoom *= 0.5;
  redraw();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
