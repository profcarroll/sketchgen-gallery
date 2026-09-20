let hexagons = [];
let stressFractures = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  
  // Create a grid of hexagons
  let spacing = 80;
  let cols = ceil(width / spacing) + 2;
  let rows = ceil(height / spacing) + 2;
  
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = (i - cols/2) * spacing;
      let y = (j - rows/2) * spacing;
      // Offset every other row
      if (j % 2 === 1) x += spacing / 2;
      
      hexagons.push({
        x: x,
        y: y,
        z: 0,
        size: 30 + random(-5, 5),
        phase: random(TWO_PI),
        connections: []
      });
    }
  }
  
  // Precompute connections between adjacent hexagons
  for (let i = 0; i < hexagons.length; i++) {
    let h1 = hexagons[i];
    for (let j = i + 1; j < hexagons.length; j++) {
      let h2 = hexagons[j];
      let d = dist(h1.x, h1.y, h2.x, h2.y);
      if (abs(d - 80) < 5) { // Adjacent hexagons
        h1.connections.push(j);
        h2.connections.push(i);
      }
    }
  }
}

function draw() {
  background(0);
  time += 0.02;
  
  // Camera movement for subtle motion
  let camX = sin(time * 0.1) * 50;
  let camY = cos(time * 0.15) * 30;
  camera(0, 0, (height/2) / tan(PI/6), camX, camY, 0, 0, 1, 0);
  
  // Draw hexagonal lattice
  for (let i = 0; i < hexagons.length; i++) {
    let h = hexagons[i];
    
    // Animate each hexagon's size and color
    let size = h.size + sin(time + h.phase) * 3;
    let brightness = 150 + sin(time * 2 + h.phase) * 50;
    
    push();
    translate(h.x, h.y, h.z);
    
    // Draw hexagon with glow effect
    fill(brightness, 100, 100, 180);
    beginShape();
    for (let j = 0; j < 6; j++) {
      let angle = TWO_PI * j / 6;
      let x = size * cos(angle);
      let y = size * sin(angle);
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Draw connecting lines
    stroke(brightness * 0.8, 100, 100, 150);
    strokeWeight(1);
    beginShape(LINES);
    for (let idx of h.connections) {
      let other = hexagons[idx];
      vertex(0, 0, 0);
      vertex(other.x - h.x, other.y - h.y, other.z - h.z);
    }
    endShape();
    
    pop();
  }
  
  // Draw stress fractures
  if (frameCount % 15 === 0) {
    stressFractures.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      size: random(50, 150),
      life: 1.0
    });
  }
  
  // Update and draw fractures
  for (let i = stressFractures.length - 1; i >= 0; i--) {
    let f = stressFractures[i];
    f.life -= 0.02;
    
    if (f.life <= 0) {
      stressFractures.splice(i, 1);
      continue;
    }
    
    // Pulsing effect
    let pulse = sin(time * 10 + f.life * 10) * 0.5 + 0.5;
    let alpha = f.life * 255;
    
    push();
    translate(f.x, f.y, 0);
    
    noFill();
    stroke(255, 255, 255, alpha * pulse);
    strokeWeight(2);
    
    beginShape();
    for (let j = 0; j < 8; j++) {
      let angle = TWO_PI * j / 8;
      let x = f.size * cos(angle) * pulse;
      let y = f.size * sin(angle) * pulse;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    pop();
  }
  
  // Subtle rotation of the whole scene
  rotateY(time * 0.01);
  rotateX(sin(time * 0.05) * 0.1);
}
