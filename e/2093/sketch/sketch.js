let threads = [];
let gridPoints = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  pixelDensity(1);
  
  // Create a structured grid of points
  const gridSize = 40;
  for (let x = 0; x < width; x += gridSize) {
    for (let y = 0; y < height; y += gridSize) {
      gridPoints.push({x, y});
    }
  }
  
  // Initialize threads with random starting positions
  for (let i = 0; i < 150; i++) {
    threads.push({
      x: random(width),
      y: random(height),
      z: random(-100, 100),
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5),
      vz: random(-0.2, 0.2),
      hue: random(360),
      sat: random(70, 100),
      bri: random(80, 100),
      life: random(100, 300),
      size: random(2, 8),
      trail: []
    });
  }
}

function draw() {
  background(10, 5, 15);
  
  time += 0.01;
  
  // Draw the static geometric grid
  stroke(255, 30);
  strokeWeight(1);
  noFill();
  
  beginShape(LINES);
  for (let i = 0; i < gridPoints.length; i++) {
    const p = gridPoints[i];
    
    // Draw vertical lines
    vertex(p.x, p.y, -50);
    vertex(p.x, p.y, 50);
    
    // Draw horizontal lines
    vertex(p.x, p.y, -50);
    vertex(p.x + 40, p.y, -50);
    vertex(p.x, p.y, 50);
    vertex(p.x + 40, p.y, 50);
  }
  endShape();
  
  // Draw the weaving threads
  for (let i = 0; i < threads.length; i++) {
    const t = threads[i];
    
    // Update thread position
    t.x += t.vx;
    t.y += t.vy;
    t.z += t.vz;
    
    // Add to trail
    t.trail.push({x: t.x, y: t.y, z: t.z});
    if (t.trail.length > 20) {
      t.trail.shift();
    }
    
    // Fade out thread as it ages
    const alpha = map(t.life, 0, 300, 0, 255);
    
    // Draw trail
    stroke(t.hue, t.sat, t.bri, alpha * 0.5);
    strokeWeight(t.size * 0.5);
    beginShape(LINES);
    for (let j = 0; j < t.trail.length - 1; j++) {
      const p1 = t.trail[j];
      const p2 = t.trail[j + 1];
      vertex(p1.x, p1.y, p1.z);
      vertex(p2.x, p2.y, p2.z);
    }
    endShape();
    
    // Draw thread head
    stroke(t.hue, t.sat, t.bri, alpha);
    strokeWeight(t.size);
    point(t.x, t.y, t.z);
    
    // Reset thread if it dies or goes off screen
    t.life--;
    if (t.life <= 0 || 
        t.x < -100 || t.x > width + 100 ||
        t.y < -100 || t.y > height + 100) {
      t.x = random(width);
      t.y = random(height);
      t.z = random(-100, 100);
      t.vx = random(-0.5, 0.5);
      t.vy = random(-0.5, 0.5);
      t.vz = random(-0.2, 0.2);
      t.hue = (t.hue + 30) % 360;
      t.life = random(100, 300);
      t.trail = [];
    }
  }
  
  // Occasionally generate new threads from grid points
  if (frameCount % 20 === 0) {
    const p = gridPoints[floor(random(gridPoints.length))];
    for (let i = 0; i < 3; i++) {
      const idx = floor(random(threads.length));
      const t = threads[idx];
      t.x = p.x;
      t.y = p.y;
      t.z = random(-100, 100);
      t.vx = random(-1, 1);
      t.vy = random(-1, 1);
      t.vz = random(-0.5, 0.5);
      t.hue = (t.hue + 60) % 360;
      t.life = random(100, 300);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
