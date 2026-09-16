let particles = [];
let crystals = [];
let time = 0;

function setup() {
  createCanvas(600, 600);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create floating particles for the luminous field
  for (let i = 0; i < 200; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      size: random(2, 8),
      speed: random(0.1, 0.5),
      hue: random(180, 220)
    });
  }
  
  // Create crystalline forms
  for (let i = 0; i < 15; i++) {
    crystals.push({
      x: random(width),
      y: random(height),
      size: random(30, 80),
      rotation: random(TWO_PI),
      speed: random(0.002, 0.005),
      hue: random(190, 210)
    });
  }
}

function draw() {
  background(200, 10, 10); // Deep aquamarine base
  
  time += 0.01;
  
  // Update and display particles
  for (let p of particles) {
    p.y += p.speed;
    if (p.y > height) p.y = 0;
    
    noStroke();
    fill(p.hue, 50, 90, 0.3);
    ellipse(p.x, p.y, p.size);
  }
  
  // Update and display crystals
  for (let c of crystals) {
    c.rotation += c.speed;
    
    push();
    translate(c.x, c.y);
    rotate(c.rotation);
    
    noStroke();
    fill(c.hue, 60, 95, 0.7);
    beginShape();
    for (let i = 0; i < 8; i++) {
      let angle = map(i, 0, 8, 0, TWO_PI);
      let x = cos(angle) * c.size;
      let y = sin(angle) * c.size;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Inner glow
    fill(c.hue, 70, 100, 0.2);
    beginShape();
    for (let i = 0; i < 8; i++) {
      let angle = map(i, 0, 8, 0, TWO_PI);
      let x = cos(angle) * c.size * 0.6;
      let y = sin(angle) * c.size * 0.6;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    pop();
  }
  
  // Add subtle light rays
  stroke(190, 30, 90, 0.2);
  strokeWeight(1);
  for (let i = 0; i < 50; i++) {
    let angle = time + i * 0.2;
    let x1 = width/2 + cos(angle) * 100;
    let y1 = height/2 + sin(angle) * 100;
    let x2 = width/2 + cos(angle) * 300;
    let y2 = height/2 + sin(angle) * 300;
    line(x1, y1, x2, y2);
  }
}
