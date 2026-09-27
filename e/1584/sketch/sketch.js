let grid;
let time = 0;
let archs = [];
let lines = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  
  // Create a grid of points
  grid = [];
  const gridSize = 30;
  for (let x = 0; x < width; x += gridSize) {
    for (let y = 0; y < height; y += gridSize) {
      grid.push({x, y});
    }
  }

  // Pre-generate some architectural fragments
  archs = [];
  for (let i = 0; i < 4; i++) {
    archs.push({
      x: random(width),
      y: random(height),
      w: random(40, 120),
      h: random(40, 120),
      type: floor(random(2)),
      time: random(TWO_PI),
      alpha: 0,
      targetAlpha: 0
    });
  }
  
  // Pre-generate lines for connections
  lines = [];
  for (let i = 0; i < grid.length; i++) {
    for (let j = i + 1; j < grid.length; j++) {
      if (dist(grid[i].x, grid[i].y, grid[j].x, grid[j].y) < 80) {
        lines.push({i, j});
      }
    }
  }
}

function draw() {
  background(10, 5, 15);
  
  time += 0.015;
  
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
    stroke(255, 80 + pulse * 175);
    vertex(p.x, p.y);
    vertex(p.x + 12 * cos(a), p.y + 12 * sin(a));
  }
  endShape();
  
  // Draw glowing neon lines connecting points
  stroke(255, 150);
  strokeWeight(1);
  beginShape(LINES);
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    const p1 = grid[l.i];
    const p2 = grid[l.j];
    
    // Pulse the connection
    const pulse = sin(time * 2 + (p1.x + p1.y) * 0.01) * 0.5 + 0.5;
    stroke(255, 80 + pulse * 175);
    vertex(p1.x, p1.y);
    vertex(p2.x, p2.y);
  }
  endShape();
  
  // Occasionally reveal architecture fragments
  if (frameCount % 180 === 0) {
    for (let i = 0; i < archs.length; i++) {
      archs[i].targetAlpha = 255;
    }
  }
  
  // Animate architectural fragments
  for (let i = 0; i < archs.length; i++) {
    const a = archs[i];
    
    // Smooth alpha transition
    if (a.alpha < a.targetAlpha) {
      a.alpha += 2;
    } else if (a.alpha > a.targetAlpha) {
      a.alpha -= 2;
    }
    
    // Fade back after some time
    if (frameCount % 300 === 0 && a.targetAlpha === 255) {
      a.targetAlpha = 0;
    }
    
    stroke(255, a.alpha);
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
  if (random() < 0.05) {
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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
