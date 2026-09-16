let gridSize = 40;
let grid = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize grid points
  for (let y = 0; y < height; y += gridSize) {
    for (let x = 0; x < width; x += gridSize) {
      grid.push({x, y});
    }
  }
}

function draw() {
  background(0);
  
  time += 0.01;
  
  // Draw the grid lines with pulsing effect
  stroke(200, 80, 90, 0.7);
  strokeWeight(1);
  
  beginShape();
  for (let i = 0; i < grid.length; i++) {
    const p = grid[i];
    const pulse = sin(time + i * 0.05) * 0.3 + 0.7;
    
    // Create a subtle pulsing effect on connections
    if (i % 2 === 0) {
      vertex(p.x, p.y);
    }
  }
  endShape(CLOSE);
  
  // Draw fractal-like connections
  stroke(180, 90, 100, 0.5);
  strokeWeight(0.5);
  
  for (let i = 0; i < grid.length; i++) {
    const p1 = grid[i];
    const pulse1 = sin(time + i * 0.03) * 0.5 + 0.5;
    
    // Draw connections to nearby points
    for (let j = i + 1; j < grid.length; j++) {
      const p2 = grid[j];
      const d = dist(p1.x, p1.y, p2.x, p2.y);
      
      if (d < gridSize * 2.5) {
        const pulse2 = sin(time + j * 0.03) * 0.5 + 0.5;
        const intensity = (pulse1 + pulse2) / 2;
        
        // Staggered pulsing
        if (frameCount % 10 === 0) {
          line(p1.x, p1.y, p2.x, p2.y);
        }
      }
    }
  }
  
  // Draw central fractal pattern
  push();
  translate(width/2, height/2);
  const fractalSize = 100 + sin(time * 0.5) * 30;
  
  stroke(240, 100, 100, 0.8);
  strokeWeight(1);
  
  for (let i = 0; i < 6; i++) {
    const angle = TWO_PI / 6 * i + time * 0.2;
    const x1 = cos(angle) * fractalSize;
    const y1 = sin(angle) * fractalSize;
    
    line(0, 0, x1, y1);
  }
  
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
