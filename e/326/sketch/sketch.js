let grids = [];
let particles = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create grid of neon lines
  for (let i = 0; i < 20; i++) {
    grids.push({
      x: random(width),
      y: random(height),
      size: random(100, 300),
      speed: random(0.005, 0.02),
      hue: random(200, 300)
    });
  }
  
  // Create particles that form organic shapes
  for (let i = 0; i < 500; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      speed: random(0.001, 0.005),
      hue: random(200, 300),
      life: random(100, 200)
    });
  }
}

function draw() {
  background(0, 0, 0, 0.05);
  
  time += 0.01;
  
  // Draw and update grids
  for (let i = 0; i < grids.length; i++) {
    let g = grids[i];
    
    push();
    translate(g.x, g.y);
    rotate(time * g.speed);
    
    stroke(g.hue, 80, 90, 0.7);
    noFill();
    
    // Draw grid lines
    for (let j = 0; j < 10; j++) {
      let angle = map(j, 0, 10, 0, TWO_PI);
      let x1 = cos(angle) * g.size;
      let y1 = sin(angle) * g.size;
      let x2 = cos(angle + PI) * g.size;
      let y2 = sin(angle + PI) * g.size;
      
      // Add pulsing effect to lines
      let pulse = sin(time * 3 + j) * 0.2 + 0.8;
      strokeWeight(1 * pulse);
      
      line(x1, y1, x2, y2);
    }
    
    pop();
  }
  
  // Draw particles forming organic shapes
  beginShape(POINTS);
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Update position with sine wave motion
    p.x += sin(time * p.speed + p.life) * 0.5;
    p.y += cos(time * p.speed + p.life) * 0.5;
    
    // Fade out and reset particles
    if (p.life <= 0) {
      p.x = random(width);
      p.y = random(height);
      p.life = random(100, 200);
    }
    
    p.life -= 0.5;
    
    // Particle properties
    fill(p.hue, 80, 90, 0.7);
    noStroke();
    
    vertex(p.x, p.y);
  }
  endShape();
  
  // Create architectural fragments from particles
  for (let i = 0; i < 5; i++) {
    let x = width / 2 + sin(time * 0.5 + i) * 100;
    let y = height / 2 + cos(time * 0.3 + i) * 100;
    
    push();
    translate(x, y);
    
    stroke(240, 80, 90, 0.6);
    noFill();
    
    // Draw geometric shapes that morph into organic forms
    let size = sin(time + i) * 30 + 50;
    ellipse(0, 0, size, size);
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
