let sandParticles = [];
let waveOffset = 0;
let mouseSand = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Create initial sand piles
  for (let i = 0; i < 1000; i++) {
    sandParticles.push({
      x: random(width * 0.3, width * 0.7),
      y: random(height * 0.6, height * 0.9),
      size: random(2, 6),
      color: color(240, 230, 180)
    });
  }
  
  // Create wooden stall
  rectMode(CENTER);
}

function draw() {
  background(135, 206, 235); // Sky blue
  
  // Draw sun
  fill(255, 255, 200);
  noStroke();
  ellipse(width * 0.8, height * 0.2, 80, 80);
  
  // Draw wooden stall
  fill(139, 69, 19);
  rect(width * 0.5, height * 0.7, 120, 100);
  
  // Draw stall roof
  fill(101, 67, 33);
  triangle(width * 0.5 - 60, height * 0.7,
           width * 0.5 + 60, height * 0.7,
           width * 0.5, height * 0.6);
  
  // Draw sand piles
  for (let p of sandParticles) {
    fill(p.color);
    ellipse(p.x, p.y, p.size, p.size);
  }
  
  // Draw waves
  waveOffset += 0.02;
  drawWaves();
  
  // Apply mouse interaction
  applyMouseInteraction();
  
  // Update and display mouse sand effects
  for (let i = mouseSand.length - 1; i >= 0; i--) {
    let m = mouseSand[i];
    fill(m.color);
    ellipse(m.x, m.y, m.size, m.size);
    m.life--;
    if (m.life <= 0) {
      mouseSand.splice(i, 1);
    }
  }
}

function drawWaves() {
  // Draw gentle waves
  fill(173, 216, 230, 150);
  noStroke();
  
  for (let i = 0; i < 10; i++) {
    let waveHeight = sin(waveOffset + i * 0.5) * 5;
    let y = height * 0.8 + waveHeight;
    
    beginShape();
    for (let x = -50; x < width + 50; x += 10) {
      let wave = sin(x * 0.02 + waveOffset + i * 0.3) * 3;
      vertex(x, y + wave);
    }
    vertex(width, height);
    vertex(0, height);
    endShape(CLOSE);
  }
}

function applyMouseInteraction() {
  // Create sand effect where mouse is
  if (mouseIsPressed) {
    let mouseRadius = 30;
    for (let i = 0; i < 10; i++) {
      let angle = random(TWO_PI);
      let distance = random(mouseRadius);
      let x = mouseX + cos(angle) * distance;
      let y = mouseY + sin(angle) * distance;
      
      mouseSand.push({
        x: x,
        y: y,
        size: random(3, 6),
        color: color(240, 230, 180),
        life: random(30, 60)
      });
    }
    
    // Move sand particles near mouse
    for (let p of sandParticles) {
      let d = dist(p.x, p.y, mouseX, mouseY);
      if (d < 150) {
        let force = map(d, 0, 150, 1, 0);
        p.x += random(-force, force);
        p.y += random(-force, force);
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
