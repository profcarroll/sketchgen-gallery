let shapes = [];
let gradient;
let focalThought = null;
let isPaused = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create a deep, saturated gradient background
  gradient = createGraphics(width, height);
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(240, 80, 20), color(260, 90, 30), inter);
    gradient.stroke(c);
    gradient.line(0, y, width, y);
  }
  
  // Initialize some shapes
  for (let i = 0; i < 100; i++) {
    shapes.push({
      x: random(width),
      y: random(height),
      size: random(5, 30),
      hue: random(180, 240),
      alpha: random(0.3, 0.7),
      speedX: random(-0.5, 0.5),
      speedY: random(-0.5, 0.5),
      life: random(100, 300),
      maxLife: 300,
      type: random(['circle', 'arc', 'glyph'])
    });
  }
}

function draw() {
  // Draw background gradient
  image(gradient, 0, 0);
  
  if (isPaused) {
    // Draw focal thought at center
    if (focalThought) {
      push();
      translate(width/2, height/2);
      noStroke();
      fill(focalThought.hue, 100, 100, 0.8);
      ellipse(0, 0, focalThought.size * 2);
      
      // Draw ripples
      for (let i = 0; i < 5; i++) {
        let rippleSize = focalThought.size + i * 20;
        let rippleAlpha = map(i, 0, 4, 0.6, 0);
        stroke(focalThought.hue, 100, 100, rippleAlpha);
        noFill();
        ellipse(0, 0, rippleSize * 2);
      }
      pop();
    }
    return;
  }

  // Update and draw shapes
  for (let i = shapes.length - 1; i >= 0; i--) {
    let shape = shapes[i];
    
    // Move shape
    shape.x += shape.speedX;
    shape.y += shape.speedY;
    
    // Bounce off edges
    if (shape.x < 0 || shape.x > width) shape.speedX *= -1;
    if (shape.y < 0 || shape.y > height) shape.speedY *= -1;
    
    // Fade out as life decreases
    shape.life--;
    shape.alpha = map(shape.life, 0, shape.maxLife, 0, 0.7);
    
    if (shape.life <= 0) {
      shapes.splice(i, 1);
      // Add a new one to keep the count steady
      shapes.push({
        x: random(width),
        y: random(height),
        size: random(5, 30),
        hue: random(180, 240),
        alpha: random(0.3, 0.7),
        speedX: random(-0.5, 0.5),
        speedY: random(-0.5, 0.5),
        life: random(100, 300),
        maxLife: 300,
        type: random(['circle', 'arc', 'glyph'])
      });
    } else {
      // Draw the shape
      push();
      translate(shape.x, shape.y);
      noStroke();
      fill(shape.hue, 100, 100, shape.alpha);
      
      switch (shape.type) {
        case 'circle':
          ellipse(0, 0, shape.size * 2);
          break;
        case 'arc':
          arc(0, 0, shape.size * 2, shape.size * 2, 0, PI);
          break;
        case 'glyph':
          // Simple glyph-like shape
          for (let j = 0; j < 5; j++) {
            let angle = map(j, 0, 4, 0, TWO_PI);
            let x = cos(angle) * shape.size/2;
            let y = sin(angle) * shape.size/2;
            ellipse(x, y, shape.size/3);
          }
          break;
      }
      
      pop();
    }
  }
}

function mousePressed() {
  // Pause and set focal thought
  isPaused = true;
  focalThought = {
    hue: random(180, 240),
    size: random(50, 100)
  };
  
  // Resume after a delay
  setTimeout(() => {
    isPaused = false;
    focalThought = null;
  }, 3000);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
