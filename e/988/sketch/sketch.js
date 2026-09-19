let textures = [];
let knots = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Create textile layers
  for (let i = 0; i < 5; i++) {
    textures.push({
      layer: i,
      speed: random(0.001, 0.003),
      color: color(random(100, 255), random(100, 255), random(100, 255), 150),
      noiseScale: random(0.01, 0.03)
    });
  }
  
  // Create geometric knots
  for (let i = 0; i < 200; i++) {
    knots.push({
      x: random(width),
      y: random(height),
      size: random(5, 20),
      rotation: random(TWO_PI),
      speed: random(0.01, 0.03)
    });
  }
}

function draw() {
  background(20);
  
  time += 0.01;
  
  // Draw textile layers
  for (let t of textures) {
    fill(t.color);
    beginShape();
    for (let x = 0; x < width + 100; x += 50) {
      for (let y = 0; y < height + 100; y += 50) {
        let n = noise(x * t.noiseScale, y * t.noiseScale, time * t.speed);
        let px = x + sin(time * t.speed + x * 0.01) * 30 * n;
        let py = y + cos(time * t.speed + y * 0.01) * 30 * n;
        vertex(px, py);
      }
    }
    endShape(CLOSE);
  }
  
  // Draw knots
  for (let k of knots) {
    push();
    translate(k.x, k.y);
    rotate(time * k.speed);
    
    // Create a geometric knot shape using multiple polygons
    fill(255, 200);
    beginShape();
    for (let i = 0; i < 8; i++) {
      let angle = map(i, 0, 8, 0, TWO_PI);
      let x = k.size * cos(angle);
      let y = k.size * sin(angle);
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Add inner details
    fill(255, 100);
    beginShape();
    for (let i = 0; i < 6; i++) {
      let angle = map(i, 0, 6, 0, TWO_PI);
      let x = k.size * 0.4 * cos(angle);
      let y = k.size * 0.4 * sin(angle);
      vertex(x, y);
    }
    endShape(CLOSE);
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
