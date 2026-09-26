let waves = [];
let time = 0;
let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize jellyfish body with multiple wave layers
  for (let i = 0; i < 5; i++) {
    waves.push({
      radius: random(200, 400),
      speed: random(0.005, 0.02),
      amplitude: random(10, 50),
      frequency: random(0.01, 0.03),
      hue: random(180, 240), // Deep blue to cyan
      alpha: random(0.2, 0.6)
    });
  }
  
  // Initialize particles for bioluminescent effect
  for (let i = 0; i < 200; i++) {
    particles.push({
      angle: random(TWO_PI),
      radius: random(100, 300),
      speed: random(0.001, 0.005),
      size: random(1, 3),
      hue: random(240, 360)
    });
  }
}

function draw() {
  background(0, 0, 5, 0.95); // Dark with slight fade
  
  time += 0.01;
  
  // Draw each wave layer with segmented edges
  for (let i = 0; i < waves.length; i++) {
    let w = waves[i];
    
    push();
    translate(width/2, height/2);
    
    noFill();
    stroke(w.hue, 80, 90, w.alpha);
    strokeWeight(2);
    
    // Draw segmented polygon with sharp edges
    beginShape();
    let segments = 30; // Fewer segments for prismatic effect
    for (let a = 0; a < TWO_PI; a += TWO_PI / segments) {
      let x = cos(a) * (w.radius + sin(time * w.speed + a * w.frequency) * w.amplitude);
      let y = sin(a) * (w.radius + sin(time * w.speed + a * w.frequency) * w.amplitude);
      vertex(x, y);
    }
    endShape(CLOSE);
    
    pop();
  }
  
  // Draw floating particles with prismatic flashes
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    p.angle += p.speed;
    p.radius += sin(time * 0.5 + i) * 0.5;
    
    let x = width/2 + cos(p.angle) * p.radius;
    let y = height/2 + sin(p.angle) * p.radius;
    
    let hue = (time * 20 + p.hue + i * 2) % 360;
    fill(hue, 100, 100, 0.7);
    noStroke();
    ellipse(x, y, p.size, p.size);
  }
  
  // Add dynamic flashes from segmented lines
  push();
  translate(width/2, height/2);
  stroke(300, 100, 100, 0.8);
  strokeWeight(1);
  
  for (let i = 0; i < 20; i++) {
    let angle = time * 0.5 + i * 0.3;
    let radius = 100 + sin(time * 0.7 + i) * 40;
    let x1 = cos(angle) * radius;
    let y1 = sin(angle) * radius;
    let x2 = cos(angle + PI/4) * (radius + 30);
    let y2 = sin(angle + PI/4) * (radius + 30);
    
    line(x1, y1, x2, y2);
  }
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
