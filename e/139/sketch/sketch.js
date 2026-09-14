let elements = [];
let gridSpacing = 40;
let canvasWidth, canvasHeight;

function setup() {
  canvasWidth = 800;
  canvasHeight = 600;
  createCanvas(canvasWidth, canvasHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noFill();
  strokeWeight(2);

  // Initialize grid elements
  for (let x = 0; x < width; x += gridSpacing) {
    for (let y = 0; y < height; y += gridSpacing) {
      if (random() > 0.7) {
        elements.push({
          type: 'line',
          x1: x + random(-5, 5),
          y1: y + random(-5, 5),
          x2: x + random(-5, 5),
          y2: y + random(-5, 5),
          hue: random(0, 30),
          alpha: random(0.3, 0.7),
          lifespan: random(100, 300)
        });
      } else {
        elements.push({
          type: 'box',
          x: x + random(-5, 5),
          y: y + random(-5, 5),
          w: random(20, 40),
          h: random(20, 40),
          hue: random(30, 60),
          alpha: random(0.2, 0.5),
          lifespan: random(100, 300)
        });
      }
    }
  }
}

function draw() {
  background(0, 0, 95);

  // Update and display elements
  for (let i = elements.length - 1; i >= 0; i--) {
    let el = elements[i];
    el.lifespan--;
    
    if (el.lifespan <= 0) {
      elements.splice(i, 1);
      continue;
    }

    stroke(el.hue, 80, 20, el.alpha);
    
    if (el.type === 'line') {
      line(el.x1, el.y1, el.x2, el.y2);
    } else if (el.type === 'box') {
      rect(el.x, el.y, el.w, el.h);
    }
  }

  // Add new elements occasionally
  if (random() > 0.95) {
    if (random() > 0.5) {
      elements.push({
        type: 'line',
        x1: random(width),
        y1: random(height),
        x2: random(width),
        y2: random(height),
        hue: random(0, 30),
        alpha: random(0.3, 0.7),
        lifespan: random(100, 300)
      });
    } else {
      elements.push({
        type: 'box',
        x: random(width),
        y: random(height),
        w: random(20, 40),
        h: random(20, 40),
        hue: random(30, 60),
        alpha: random(0.2, 0.5),
        lifespan: random(100, 300)
      });
    }
  }

  // Simulate cursor interaction
  for (let i = 0; i < elements.length; i++) {
    let el = elements[i];
    if (el.type === 'line') {
      let dx = mouseX - (el.x1 + el.x2) / 2;
      let dy = mouseY - (el.y1 + el.y2) / 2;
      let distance = dist(mouseX, mouseY, (el.x1 + el.x2) / 2, (el.y1 + el.y2) / 2);
      
      if (distance < 50) {
        el.x1 += dx * 0.01;
        el.y1 += dy * 0.01;
        el.x2 += dx * 0.01;
        el.y2 += dy * 0.01;
      }
    } else if (el.type === 'box') {
      let dx = mouseX - (el.x + el.w / 2);
      let dy = mouseY - (el.y + el.h / 2);
      let distance = dist(mouseX, mouseY, el.x + el.w / 2, el.y + el.h / 2);
      
      if (distance < 50) {
        el.w += dx * 0.01;
        el.h += dy * 0.01;
        el.w = constrain(el.w, 10, 100);
        el.h = constrain(el.h, 10, 100);
      }
    }
  }

  // Draw a subtle grid overlay for structure
  stroke(0, 0, 80, 0.1);
  for (let x = 0; x < width; x += gridSpacing) {
    line(x, 0, x, height);
  }
  for (let y = 0; y < height; y += gridSpacing) {
    line(0, y, width, y);
  }
}
