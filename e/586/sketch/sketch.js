let ships = [];
let trails = [];

function setup() {
  createCanvas(600, 400);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Create initial ships
  for (let i = 0; i < 5; i++) {
    ships.push({
      x: random(width),
      y: random(height),
      size: random(30, 60),
      rotation: random(TWO_PI),
      speed: random(0.2, 0.5),
      age: 0,
      tear: random(10, 30),
      barnacles: [],
      moss: []
    });
  }
  
  // Initialize barnacles and moss
  for (let s of ships) {
    for (let i = 0; i < 5; i++) {
      s.barnacles.push({
        x: random(-s.size/2, s.size/2),
        y: random(-s.size/2, s.size/2),
        size: random(3, 8)
      });
    }
    for (let i = 0; i < 3; i++) {
      s.moss.push({
        x: random(-s.size/2, s.size/2),
        y: random(-s.size/2, s.size/2),
        size: random(2, 5)
      });
    }
  }
}

function draw() {
  background(200, 10, 95);
  
  // Draw trails
  for (let t of trails) {
    fill(t.hue, t.sat, t.bri, t.alpha);
    ellipse(t.x, t.y, t.size);
    t.alpha -= 0.01;
    t.size *= 0.99;
  }
  
  // Remove faded trails
  trails = trails.filter(t => t.alpha > 0);
  
  // Update and draw ships
  for (let s of ships) {
    // Slow drift
    s.x += cos(s.rotation) * s.speed;
    s.y += sin(s.rotation) * s.speed;
    
    // Gentle rotation
    s.rotation += random(-0.01, 0.01);
    
    // Age the ship
    s.age += 0.01;
    
    // Fade out over time
    let alpha = map(s.age, 0, 2, 1, 0.2);
    
    // Draw ship body (translucent)
    fill(30, 50, 90, alpha * 0.4);
    push();
    translate(s.x, s.y);
    rotate(s.rotation);
    rectMode(CENTER);
    rect(0, 0, s.size, s.size * 0.6);
    
    // Draw windows
    fill(180, 50, 90, alpha * 0.8);
    ellipse(-s.size/4, -s.size/6, s.size/5, s.size/5);
    ellipse(s.size/4, -s.size/6, s.size/5, s.size/5);
    
    // Draw tears
    fill(30, 50, 90, alpha * 0.5);
    for (let i = 0; i < s.tear; i++) {
      let tx = random(-s.size/4, s.size/4);
      let ty = random(-s.size/6, s.size/6);
      ellipse(tx, ty, random(2, 5));
    }
    
    // Draw barnacles
    fill(100, 30, 30, alpha * 0.7);
    for (let b of s.barnacles) {
      ellipse(b.x, b.y, b.size);
    }
    
    // Draw moss
    fill(120, 40, 20, alpha * 0.6);
    for (let m of s.moss) {
      ellipse(m.x, m.y, m.size);
    }
    
    pop();
    
    // Leave trail behind
    if (frameCount % 5 === 0) {
      trails.push({
        x: s.x,
        y: s.y,
        hue: random(200, 240),
        sat: random(30, 50),
        bri: random(60, 80),
        alpha: 0.8,
        size: random(1, 3)
      });
    }
    
    // Wrap around edges
    if (s.x < -s.size) s.x = width + s.size;
    if (s.x > width + s.size) s.x = -s.size;
    if (s.y < -s.size) s.y = height + s.size;
    if (s.y > height + s.size) s.y = -s.size;
  }
}
