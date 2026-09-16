let structures = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Initialize a few fluid geometric structures
  for (let i = 0; i < 15; i++) {
    structures.push({
      pos: createVector(random(width), random(height)),
      size: random(30, 100),
      speed: random(0.01, 0.03),
      angle: random(TWO_PI),
      color: color(random(255), random(255), random(255), 180),
      connections: []
    });
  }
}

function draw() {
  background(10);
  time += 0.02;

  // Update and display structures
  for (let i = 0; i < structures.length; i++) {
    let s = structures[i];
    
    // Oscillating movement with wave patterns
    s.pos.x += sin(time * s.speed + s.angle) * 3;
    s.pos.y += cos(time * s.speed * 1.3 + s.angle) * 3;
    
    // Morph size based on time
    s.size = 30 + sin(time * s.speed * 2) * 40;
    
    // Color shift using sine waves across RGB
    let r = (sin(time * 0.05 + i) + 1) * 127.5;
    let g = (sin(time * 0.07 + i) + 1) * 127.5;
    let b = (sin(time * 0.09 + i) + 1) * 127.5;
    s.color = color(r, g, b, 180);
    
    // Draw the structure
    push();
    translate(s.pos.x, s.pos.y);
    rotate(time * s.speed);
    fill(s.color);
    noStroke();
    
    // Alternate between shapes
    if (frameCount % 20 < 10) {
      ellipse(0, 0, s.size);
    } else {
      rectMode(CENTER);
      rect(0, 0, s.size, s.size);
    }
    pop();

    // Connect to nearby structures
    for (let j = 0; j < structures.length; j++) {
      if (i !== j) {
        let d = dist(s.pos.x, s.pos.y, structures[j].pos.x, structures[j].pos.y);
        if (d < 150) {
          stroke(s.color);
          strokeWeight(0.5);
          line(s.pos.x, s.pos.y, structures[j].pos.x, structures[j].pos.y);
        }
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
