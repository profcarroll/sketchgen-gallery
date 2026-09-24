let grid;
let time = 0;
let archs = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  
  // Create a grid of points
  grid = [];
  const gridSize = 40;
  for (let x = 0; x < width; x += gridSize) {
    for (let y = 0; y < height; y += gridSize) {
      grid.push({x, y});
    }
  }

  // Pre-generate some architectural fragments
  archs = [];
  for (let i = 0; i < 5; i++) {
    archs.push({
      x: random(width),
      y: random(height),
      w: random(30, 100),
      h: random(30, 100),
      type: floor(random(2)),
      time: random(TWO_PI)
    });
  }
}

function draw() {
  background(15, 10, 20);
  
  time += 0.02;
  
  // Draw pulsing grid lines
  stroke(255, 30);
  strokeWeight(1);
  noFill();
  
  beginShape(LINES);
  for (let i = 0; i < grid.length; i++) {
    const p = grid[i];
    const n = noise(p.x * 0.01, p.y * 0.01, time * 0.5);
    const a = map(n, 0, 1, 0, TWO_PI);
    const pulse = sin(time + a) * 0.5 + 0.5;
    
    // Pulsing grid
    stroke(255, 100 + pulse * 155);
    vertex(p.x, p.y);
    vertex(p.x + 10 * cos(a), p.y + 10 * sin(a));
  }
  endShape();
  
  // Draw glowing neon lines connecting points
  stroke(255, 200);
  strokeWeight(1);
  beginShape(LINES);
  for (let i = 0; i < grid.length; i++) {
    const p1 = grid[i];
    for (let j = i + 1; j < grid.length; j++) {
      const p2 = grid[j];
      const d = dist(p1.x, p1.y, p2.x, p2.y);
      if (d < 80) {
        // Pulse the connection
        const pulse = sin(time * 2 + d * 0.01) * 0.5 + 0.5;
        stroke(255, 100 + pulse * 155);
        vertex(p1.x, p1.y);
        vertex(p2.x, p2.y);
      }
    }
  }
  endShape();
  
  // Occasionally reveal architecture fragments
  if (frameCount % 120 === 0) {
    for (let i = 0; i < archs.length; i++) {
      archs[i].time = time;
    }
  }
  
  // Draw architectural fragments
  for (let i = 0; i < archs.length; i++) {
    const a = archs[i];
    a.time += 0.05;
    
    const pulse = sin(a.time) * 0.5 + 0.5;
    const alpha = 200 + pulse * 55;
    
    stroke(255, alpha);
    strokeWeight(2);
    noFill();
    
    if (a.type === 0) {
      // Classical
      rect(a.x - a.w/2, a.y - a.h/2, a.w, a.h);
      line(a.x - a.w/2, a.y - a.h/2, a.x + a.w/2, a.y + a.h/2);
      line(a.x + a.w/2, a.y - a.h/2, a.x - a.w/2, a.y + a.h/2);
    } else {
      // Modern
      rect(a.x - a.w/2, a.y - a.h/2, a.w, a.h);
      ellipse(a.x, a.y, a.w * 0.6, a.h * 0.6);
    }
  }
  
  // Randomly flicker grid lines
  if (random() < 0.1) {
    stroke(255, 255);
    strokeWeight(3);
    beginShape(LINES);
    const idx = floor(random(grid.length));
    const p = grid[idx];
    vertex(p.x - 5, p.y - 5);
    vertex(p.x + 5, p.y + 5);
    endShape();
  }
}
