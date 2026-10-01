let grid = [];
let time = 0;
let archs = [];
let connections = [];
let points = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  pixelDensity(1);
  
  // Create a grid of points
  const gridSize = 25;
  for (let x = 0; x < width; x += gridSize) {
    for (let y = 0; y < height; y += gridSize) {
      grid.push({x, y, stable: false, pulse: 0});
    }
  }

  // Pre-generate some architectural fragments
  archs = [];
  for (let i = 0; i < 5; i++) {
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
  
  // Pre-generate connections between nearby points
  connections = [];
  for (let i = 0; i < grid.length; i++) {
    for (let j = i + 1; j < grid.length; j++) {
      if (dist(grid[i].x, grid[i].y, grid[j].x, grid[j].y) < 80) {
        connections.push({i, j});
      }
    }
  }
  
  // Pre-generate points for stable grid
  points = [];
  for (let i = 0; i < 2000; i++) {
    points.push({
      x: random(width),
      y: random(height),
      z: random(-100, 100),
      size: random(1, 3)
    });
  }
}

function draw() {
  background(10, 5, 15);
  
  time += 0.01;
  
  // Draw pulsing grid lines
  stroke(255, 30);
  strokeWeight(1);
  noFill();
  
  beginShape(LINES);
  for (let i = 0; i < grid.length; i++) {
    const p = grid[i];
    
    // Apply noise to determine pulse
    const n = noise(p.x * 0.01, p.y * 0.01, time * 0.5);
    const a = map(n, 0, 1, 0, TWO_PI);
    const pulse = sin(time + a) * 0.5 + 0.5;
    
    // Pulsing grid
    stroke(255, 80 + pulse * 175);
    vertex(p.x, p.y, 0);
    vertex(p.x + 12 * cos(a), p.y + 12 * sin(a), 0);
    
    // Occasionally stabilize points
    if (random() < 0.001 && !p.stable) {
      p.stable = true;
    }
  }
  endShape();
  
  // Draw glowing neon lines connecting points
  stroke(255, 150);
  strokeWeight(1);
  beginShape(LINES);
  for (let i = 0; i < connections.length && i < 1000; i++) {
    const l = connections[i];
    const p1 = grid[l.i];
    const p2 = grid[l.j];
    
    // Only draw if both points are not yet stable
    if (!p1.stable && !p2.stable) {
      // Pulse the connection
      const pulse = sin(time * 2 + (p1.x + p1.y) * 0.01) * 0.5 + 0.5;
      stroke(255, 80 + pulse * 175);
      vertex(p1.x, p1.y, 0);
      vertex(p2.x, p2.y, 0);
    }
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
  
  // Draw stable grid points as permanent glowing dots
  stroke(255, 200);
  strokeWeight(2);
  noFill();
  
  beginShape(POINTS);
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    if (random() < 0.001) {
      point(p.x, p.y, p.z);
    }
  }
  endShape();
  
  // Randomly flicker grid lines
  if (random() < 0.05) {
    stroke(255, 255);
    strokeWeight(3);
    beginShape(LINES);
    const idx = floor(random(grid.length));
    const p = grid[idx];
    vertex(p.x - 5, p.y - 5, 0);
    vertex(p.x + 5, p.y + 5, 0);
    endShape();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
