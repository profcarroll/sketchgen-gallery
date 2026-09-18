const GRID_SIZE = 20;
const CELL_SIZE = 20;
let grid = [];
let waveEffect = [];
let shadows = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  
  // Initialize grid
  for (let i = 0; i < GRID_SIZE; i++) {
    grid[i] = [];
    for (let j = 0; j < GRID_SIZE; j++) {
      grid[i][j] = {
        pulse: 0,
        shadow: 0,
        originalColor: random(180, 255)
      };
    }
  }
  
  // Initialize shadows array
  for (let i = 0; i < GRID_SIZE; i++) {
    shadows[i] = [];
    for (let j = 0; j < GRID_SIZE; j++) {
      shadows[i][j] = 0;
    }
  }
}

function draw() {
  background(10);
  
  time += 0.02;
  
  // Draw grid
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      const cell = grid[i][j];
      
      // Calculate pulse effect
      cell.pulse = sin(time + i * 0.2 + j * 0.2) * 0.3 + 0.7;
      
      // Apply shadow effect
      const shadowEffect = shadows[i][j] * 0.95;
      shadows[i][j] = shadowEffect;
      
      // Calculate final color
      const baseColor = cell.originalColor;
      const finalColor = baseColor * cell.pulse + shadowEffect * 0.3;
      
      fill(finalColor);
      noStroke();
      
      const x = i * CELL_SIZE + CELL_SIZE / 2;
      const y = j * CELL_SIZE + CELL_SIZE / 2;
      const size = CELL_SIZE * cell.pulse;
      
      rect(x - size/2, y - size/2, size, size);
    }
  }
  
  // Process wave effects
  for (let i = waveEffect.length - 1; i >= 0; i--) {
    const w = waveEffect[i];
    w.radius += 3;
    
    if (w.radius > 50) {
      waveEffect.splice(i, 1);
    }
  }
  
  // Draw waves
  for (let i = 0; i < waveEffect.length; i++) {
    const w = waveEffect[i];
    const c = color(random(255), random(255), random(255), 100);
    fill(c);
    noStroke();
    
    // Draw ripple effect
    ellipse(w.x, w.y, w.radius * 2, w.radius * 2);
    
    // Update shadows where wave passes
    for (let di = -3; di <= 3; di++) {
      for (let dj = -3; dj <= 3; dj++) {
        const ni = Math.floor((w.x + di * CELL_SIZE) / CELL_SIZE);
        const nj = Math.floor((w.y + dj * CELL_SIZE) / CELL_SIZE);
        
        if (ni >= 0 && ni < GRID_SIZE && nj >= 0 && nj < GRID_SIZE) {
          // Only affect if close to the wave
          const dist = dist(w.x, w.y, ni * CELL_SIZE + CELL_SIZE/2, nj * CELL_SIZE + CELL_SIZE/2);
          if (dist < w.radius + CELL_SIZE/2) {
            shadows[ni][nj] = 150;
          }
        }
      }
    }
  }
}

function mousePressed() {
  // Create a wave effect at the click point
  const x = mouseX;
  const y = mouseY;
  
  waveEffect.push({
    x: x,
    y: y,
    radius: 0
  });
}
