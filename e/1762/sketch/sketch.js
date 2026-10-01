let grid = [];
let gridSize = 40;
let cellSize;
let time = 0;
let breakdowns = [];

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
  
  // Occasionally trigger breakdowns
  if (frameCount % 120 === 0 && random() > 0.7) {
    let x = floor(random(gridSize));
    let y = 0; // Start from top
    breakdowns.push({
      x: x,
      y: y,
      age: 0,
      maxAge: 60,
      size: random(20, 50)
    });
  }
  
  // Update and draw breakdowns
  for (let i = breakdowns.length - 1; i >= 0; i--) {
    let b = breakdowns[i];
    b.age++;
    
    if (b.age > b.maxAge) {
      breakdowns.splice(i, 1);
      continue;
    }
    
    // Draw fractal bloom
    stroke(255, 255, 0, map(b.age, 0, b.maxAge, 255, 0));
    strokeWeight(map(b.age, 0, b.maxAge, 3, 0.5));
    
    // Draw a simple fractal pattern
    let scale = map(b.age, 0, b.maxAge, 1, 0.2);
    let size = b.size * scale;
    
    push();
    translate(b.x * cellSize + cellSize/2, b.y * cellSize + cellSize/2);
    
    // Simple recursive pattern
    drawFractal(size, 3, 0);
    
    pop();
    
    // Move breakdown downward
    b.y += 1;
  }
}

function drawFractal(size, depth, angle) {
  if (depth <= 0) return;
  
  line(0, 0, size, 0);
  
  push();
  translate(size, 0);
  rotate(angle);
  drawFractal(size * 0.7, depth - 1, angle);
  pop();
  
  push();
  translate(size, 0);
  rotate(-angle);
  drawFractal(size * 0.7, depth - 1, angle);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cellSize = min(width, height) / gridSize;
}
