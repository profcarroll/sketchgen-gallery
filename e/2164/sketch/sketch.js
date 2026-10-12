let particles = [];
let flowField = [];
let cols, rows;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Grid setup for flow field
  cols = width / 20;
  rows = height / 20;
  flowField = new Array(cols * rows);
  
  // Create initial particles
  for (let i = 0; i < 500; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      size: random(2, 8),
      speed: random(0.5, 2),
      hue: random(20, 40), // Warm earth tones
      saturation: random(60, 80),
      brightness: random(70, 90),
      age: 0,
      maxAge: random(100, 300)
    });
  }
}

function draw() {
  background(0);
  
  time += 0.01;
  
  // Update and display flow field
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let index = x + y * cols;
      let angle = noise(x * 0.02, y * 0.02, time) * TWO_PI * 2;
      flowField[index] = angle;
    }
  }
  
  // Update and display particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Get flow field value at particle position
    let xIndex = floor(p.x / 20);
    let yIndex = floor(p.y / 20);
    if (xIndex >= 0 && xIndex < cols && yIndex >= 0 && yIndex < rows) {
      let index = xIndex + yIndex * cols;
      let angle = flowField[index];
      
      // Apply flow field to particle movement
      p.x += cos(angle) * p.speed;
      p.y += sin(angle) * p.speed;
      
      // Boundary checks
      if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
        p.x = random(width);
        p.y = random(height);
        p.age = 0;
      }
      
      // Age particle
      p.age++;
      if (p.age > p.maxAge) {
        p.x = random(width);
        p.y = random(height);
        p.age = 0;
      }
      
      // Draw particle with soft focus effect
      noStroke();
      fill(p.hue, p.saturation, p.brightness, 0.3);
      ellipse(p.x, p.y, p.size * (1 + sin(time + p.age * 0.1) * 0.5));
    }
  }
  
  // Draw connecting lines between nearby particles
  for (let i = 0; i < particles.length; i++) {
    let p1 = particles[i];
    for (let j = i + 1; j < particles.length; j++) {
      let p2 = particles[j];
      
      let d = dist(p1.x, p1.y, p2.x, p2.y);
      if (d < 50) {
        stroke(p1.hue, p1.saturation, p1.brightness, map(d, 0, 50, 0.3, 0));
        line(p1.x, p1.y, p2.x, p2.y);
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
