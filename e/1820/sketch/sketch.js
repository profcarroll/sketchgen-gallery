let grid = [];
let gridSize = 60;
let cellSize;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  cellSize = min(width, height) / gridSize;
  
  // Initialize grid points
  for (let i = 0; i < gridSize; i++) {
    grid[i] = [];
    for (let j = 0; j < gridSize; j++) {
      grid[i][j] = {
        x: i * cellSize,
        y: j * cellSize,
        baseY: j * cellSize,
        pulse: random(TWO_PI),
        wavePhase: random(TWO_PI),
        intensity: random(0.7, 1)
      };
    }
  }
}

function draw() {
  background(0);
  time += 0.02;
  
  // Draw connections
  strokeWeight(1.5);
  
  // Draw vertical lines with wave distortion
  for (let i = 0; i < gridSize; i++) {
    beginShape();
    for (let j = 0; j < gridSize; j++) {
      let point = grid[i][j];
      
      // Apply wave distortion to vertical lines
      let wave = sin(time + point.wavePhase) * 15 * point.intensity;
      point.y = point.baseY + wave;
      
      // Apply pulsing effect
      let pulse = sin(time + point.pulse) * 0.5 + 0.5;
      
      // Draw vertical lines with magenta glow
      stroke(255, 0, 255, 180 * pulse);
      vertex(point.x, point.y);
    }
    endShape();
  }
  
  // Draw horizontal lines with wave distortion
  for (let j = 0; j < gridSize; j++) {
    beginShape();
    for (let i = 0; i < gridSize; i++) {
      let point = grid[i][j];
      
      // Apply wave distortion to horizontal lines
      let wave = sin(time + point.wavePhase + PI/2) * 15 * point.intensity;
      point.x = i * cellSize + wave;
      
      // Apply pulsing effect
      let pulse = sin(time + point.pulse) * 0.5 + 0.5;
      
      // Draw horizontal lines with cyan glow
      stroke(0, 255, 255, 180 * pulse);
      vertex(point.x, point.y);
    }
    endShape();
  }
  
  // Update points for pulsing and wave effects
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      grid[i][j].pulse += 0.03;
      grid[i][j].wavePhase += 0.02;
    }
  }
  
  // Occasionally trigger vertical wave distortions
  if (frameCount % 60 === 0) {
    let x = floor(random(gridSize));
    for (let j = 0; j < gridSize; j++) {
      grid[x][j].pulse += PI; // Trigger a pulse at the top
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
