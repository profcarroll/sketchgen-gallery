let substrates = [];
let formations = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create crumpled cardboard substrate
  for (let i = 0; i < 200; i++) {
    substrates.push({
      x: random(width),
      y: random(height),
      size: random(50, 200),
      rotation: random(TWO_PI),
      segments: round(random(3, 8)),
      depth: random(0.5, 1)
    });
  }
  
  // Initialize formations
  for (let i = 0; i < 30; i++) {
    formations.push({
      x: random(width),
      y: random(height),
      size: random(10, 40),
      hue: random(180, 270),
      rotation: random(TWO_PI),
      speed: random(0.001, 0.003),
      vertices: round(random(3, 6)),
      life: random(200, 800),
      alpha: random(0.4, 0.8),
      growth: random(0.001, 0.005)
    });
  }
}

function draw() {
  background(20, 15, 10);
  
  time += 0.01;
  
  // Draw substrate
  for (let s of substrates) {
    push();
    translate(s.x, s.y);
    rotate(s.rotation);
    
    stroke(30, 20, 30);
    strokeWeight(1);
    noFill();
    
    beginShape();
    for (let i = 0; i < s.segments; i++) {
      let angle = TWO_PI / s.segments * i;
      let x = cos(angle) * s.size * s.depth;
      let y = sin(angle) * s.size * s.depth;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    pop();
  }
  
  // Update and display formations
  for (let i = formations.length - 1; i >= 0; i--) {
    let f = formations[i];
    
    // Animate formation
    f.rotation += f.speed;
    f.life--;
    f.size += f.growth;
    
    // Fade out as life decreases
    let alpha = map(f.life, 0, 800, 0, f.alpha);
    
    push();
    translate(f.x, f.y);
    rotate(f.rotation);
    
    // Draw crystalline formation
    noFill();
    stroke(f.hue, 70, 90, alpha);
    strokeWeight(1.2);
    
    beginShape();
    for (let j = 0; j < f.vertices; j++) {
      let angle = TWO_PI / f.vertices * j;
      let x = cos(angle) * f.size;
      let y = sin(angle) * f.size;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Draw internal lines
    stroke(f.hue, 50, 80, alpha * 0.6);
    strokeWeight(0.5);
    for (let j = 0; j < f.vertices; j++) {
      let angle1 = TWO_PI / f.vertices * j;
      let angle2 = TWO_PI / f.vertices * ((j + 1) % f.vertices);
      let x1 = cos(angle1) * f.size * 0.4;
      let y1 = sin(angle1) * f.size * 0.4;
      let x2 = cos(angle2) * f.size * 0.4;
      let y2 = sin(angle2) * f.size * 0.4;
      line(x1, y1, x2, y2);
    }
    
    pop();
    
    // Remove dead formations
    if (f.life <= 0 || f.size < 0) {
      formations.splice(i, 1);
    }
  }
  
  // Occasionally add new formations
  if (random() < 0.02) {
    formations.push({
      x: random(width),
      y: random(height),
      size: random(5, 20),
      hue: random(180, 270),
      rotation: random(TWO_PI),
      speed: random(0.001, 0.003),
      vertices: round(random(3, 6)),
      life: random(200, 800),
      alpha: random(0.4, 0.8),
      growth: random(0.001, 0.005)
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
