let tendrils = [];
let glyphs = [];
let particles = [];
let numTendrils = 200;
let numGlyphs = 50;
let numParticles = 300;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize tendrils
  for (let i = 0; i < numTendrils; i++) {
    tendrils.push({
      x: random(width),
      y: random(height),
      angle: random(TWO_PI),
      length: random(20, 80),
      segments: [],
      tension: random(0.01, 0.03),
      phase: random(TWO_PI),
      color: color(random(20, 40), 80, 90, 0.7),
      speed: random(0.5, 1.5)
    });
  }
  
  // Initialize glyphs
  for (let i = 0; i < numGlyphs; i++) {
    glyphs.push({
      x: random(width),
      y: random(height),
      size: random(30, 80),
      angle: random(TWO_PI),
      rotationSpeed: random(-0.01, 0.01),
      color: color(random(20, 40), 80, 90, 0.8),
      life: 0,
      maxLife: random(300, 600),
      formed: false
    });
  }
  
  // Initialize particles
  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      color: color(random(20, 40), 80, 90, 0.5),
      life: random(100, 300),
      maxLife: random(100, 300),
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5)
    });
  }
}

function draw() {
  background(0, 0, 10);
  
  // Update and draw tendrils
  for (let i = 0; i < tendrils.length; i++) {
    let t = tendrils[i];
    
    t.phase += t.tension * t.speed;
    t.x += cos(t.angle) * 0.5;
    t.y += sin(t.angle) * 0.5;
    
    // Boundary check
    if (t.x < 0 || t.x > width || t.y < 0 || t.y > height) {
      t.x = random(width);
      t.y = random(height);
    }
    
    // Draw tendrils with soft glow
    push();
    translate(t.x, t.y);
    rotate(t.angle);
    
    stroke(t.color);
    strokeWeight(1.5);
    noFill();
    
    beginShape();
    for (let j = 0; j < 15; j++) {
      let x = j * (t.length / 15);
      let y = sin(j * 0.5 + t.phase) * map(abs(sin(t.phase)), 0, 1, 0, 10);
      vertex(x, y);
    }
    endShape();
    
    pop();
  }
  
  // Update and draw glyphs
  for (let i = 0; i < glyphs.length; i++) {
    let g = glyphs[i];
    
    if (!g.formed) {
      g.life++;
      if (g.life > g.maxLife * 0.7) {
        g.formed = true;
      }
    } else {
      // Drift and rotate
      g.x += random(-0.2, 0.2);
      g.y += random(-0.2, 0.2);
      g.angle += g.rotationSpeed;
      
      // Fade out
      g.life++;
      if (g.life > g.maxLife) {
        // Reset glyph
        g.x = random(width);
        g.y = random(height);
        g.size = random(30, 80);
        g.angle = random(TWO_PI);
        g.rotationSpeed = random(-0.01, 0.01);
        g.life = 0;
        g.formed = false;
      }
      
      // Draw crystalline glyph
      push();
      translate(g.x, g.y);
      rotate(g.angle);
      
      stroke(g.color);
      strokeWeight(2);
      noFill();
      
      // Draw hexagon
      beginShape();
      for (let j = 0; j < 6; j++) {
        let angle = TWO_PI / 6 * j;
        let x = cos(angle) * g.size;
        let y = sin(angle) * g.size;
        vertex(x, y);
      }
      endShape(CLOSE);
      
      // Draw inner cross
      line(-g.size/2, 0, g.size/2, 0);
      line(0, -g.size/2, 0, g.size/2);
      
      pop();
    }
  }
  
  // Update and draw particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    p.x += p.vx;
    p.y += p.vy;
    p.life--;
    
    if (p.life <= 0) {
      p.x = random(width);
      p.y = random(height);
      p.life = p.maxLife;
      p.vx = random(-0.5, 0.5);
      p.vy = random(-0.5, 0.5);
    }
    
    // Draw particle
    fill(p.color);
    noStroke();
    ellipse(p.x, p.y, p.size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
