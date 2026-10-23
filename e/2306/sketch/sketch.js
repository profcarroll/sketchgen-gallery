let formations = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize formations
  for (let i = 0; i < 50; i++) {
    formations.push({
      x: random(width),
      y: random(height),
      size: random(20, 80),
      hue: random(180, 270),
      rotation: random(TWO_PI),
      speed: random(0.001, 0.005),
      vertices: round(random(3, 8)),
      life: random(100, 500),
      alpha: random(0.3, 0.7)
    });
  }
}

function draw() {
  background(220, 10, 5);
  
  time += 0.01;
  
  // Update and display formations
  for (let i = formations.length - 1; i >= 0; i--) {
    let f = formations[i];
    
    // Animate formation
    f.rotation += f.speed;
    f.life--;
    
    // Fade out as life decreases
    let alpha = map(f.life, 0, 500, 0, f.alpha);
    
    push();
    translate(f.x, f.y);
    rotate(f.rotation);
    
    // Draw crystalline formation
    noFill();
    stroke(f.hue, 80, 90, alpha);
    strokeWeight(1.5);
    
    beginShape();
    for (let j = 0; j < f.vertices; j++) {
      let angle = TWO_PI / f.vertices * j;
      let x = cos(angle) * f.size;
      let y = sin(angle) * f.size;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Draw internal lines
    stroke(f.hue, 60, 80, alpha * 0.5);
    strokeWeight(0.5);
    for (let j = 0; j < f.vertices; j++) {
      let angle1 = TWO_PI / f.vertices * j;
      let angle2 = TWO_PI / f.vertices * ((j + 1) % f.vertices);
      let x1 = cos(angle1) * f.size * 0.5;
      let y1 = sin(angle1) * f.size * 0.5;
      let x2 = cos(angle2) * f.size * 0.5;
      let y2 = sin(angle2) * f.size * 0.5;
      line(x1, y1, x2, y2);
    }
    
    pop();
    
    // Remove dead formations
    if (f.life <= 0) {
      formations.splice(i, 1);
    }
  }
  
  // Occasionally add new formations
  if (random() < 0.03) {
    formations.push({
      x: random(width),
      y: random(height),
      size: random(20, 80),
      hue: random(180, 270),
      rotation: random(TWO_PI),
      speed: random(0.001, 0.005),
      vertices: round(random(3, 8)),
      life: random(100, 500),
      alpha: random(0.3, 0.7)
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
