let layers = [];
let particles = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Create geological layers
  for (let i = 0; i < 8; i++) {
    layers.push({
      y: height * (0.3 + i * 0.07),
      color: color(
        120 + i * 15,
        80 + i * 10,
        40 + i * 5,
        200
      ),
      speed: 0.001 + i * 0.0002
    });
  }
  
  // Create sediment particles
  for (let i = 0; i < 2000; i++) {
    particles.push({
      x: random(width),
      y: random(height * 0.3, height * 0.9),
      size: random(1, 3),
      color: color(
        200 + random(55),
        180 + random(40),
        120 + random(60),
        180
      ),
      speed: random(0.5, 2),
      settling: false,
      targetY: 0
    });
  }
}

function draw() {
  background(180, 220, 255);
  
  time += 0.01;
  
  // Draw mountain range base
  noStroke();
  fill(100, 140, 180);
  beginShape();
  vertex(0, height);
  for (let i = 0; i < width; i += 20) {
    let y = height * 0.7 + sin(i * 0.01 + time) * 30;
    vertex(i, y);
  }
  vertex(width, height);
  endShape(CLOSE);
  
  // Draw sediment layers
  for (let layer of layers) {
    fill(layer.color);
    noStroke();
    beginShape();
    vertex(0, layer.y);
    for (let i = 0; i < width; i += 20) {
      let y = layer.y + sin(i * 0.01 + time * layer.speed) * 5;
      vertex(i, y);
    }
    vertex(width, layer.y);
    endShape(CLOSE);
  }
  
  // Animate particles
  for (let p of particles) {
    if (!p.settling) {
      // Apply gravity
      p.y += p.speed;
      
      // Check if particle has settled on terrain
      let terrainY = height * 0.7 + sin(p.x * 0.01 + time) * 30;
      if (p.y > terrainY - 20 && p.y < terrainY + 5) {
        p.settling = true;
        p.targetY = terrainY - 10;
      }
    } else {
      // Settle into position
      if (p.y > p.targetY) {
        p.y -= 0.5;
      }
    }
    
    // Draw particle
    fill(p.color);
    noStroke();
    ellipse(p.x, p.y, p.size);
    
    // Move horizontally with flow
    p.x += sin(p.y * 0.01 + time) * 0.2;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
