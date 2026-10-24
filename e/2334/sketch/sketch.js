let hexGrid = [];
let modules = [];
let waves = [];
let gridSize = 60;
let grid = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize spatial hash grid
  let cols = ceil(width / gridSize);
  let rows = ceil(height / gridSize);
  for (let i = 0; i < cols; i++) {
    grid[i] = [];
    for (let j = 0; j < rows; j++) {
      grid[i][j] = [];
    }
  }
  
  // Create hexagonal modules
  let moduleCount = 20;
  for (let i = 0; i < moduleCount; i++) {
    let x = random(gridSize, width - gridSize);
    let y = random(gridSize, height - gridSize);
    
    // Ensure modules don't overlap
    let valid = true;
    for (let mod of modules) {
      if (dist(x, y, mod.x, mod.y) < gridSize * 1.5) {
        valid = false;
        break;
      }
    }
    
    if (valid) {
      modules.push({
        x: x,
        y: y,
        hue: random(200, 240),
        pulsePhase: random(TWO_PI),
        connections: []
      });
    }
  }
  
  // Connect adjacent modules
  for (let i = 0; i < modules.length; i++) {
    for (let j = i + 1; j < modules.length; j++) {
      let d = dist(modules[i].x, modules[i].y, modules[j].x, modules[j].y);
      if (d < gridSize * 2.5) {
        modules[i].connections.push(j);
        modules[j].connections.push(i);
      }
    }
  }
  
  // Add some pixel clusters
  for (let i = 0; i < 15; i++) {
    let x = random(gridSize, width - gridSize);
    let y = random(gridSize, height - gridSize);
    let size = random(3, 8);
    let hue = random(200, 240);
    
    hexGrid.push({
      x: x,
      y: y,
      size: size,
      hue: hue,
      pulsePhase: random(TWO_PI),
      cluster: []
    });
  }
  
  // Create pixel clusters
  for (let gridCell of hexGrid) {
    let clusterSize = floor(random(3, 7));
    for (let i = 0; i < clusterSize; i++) {
      let angle = random(TWO_PI);
      let distance = random(10, 25);
      let px = gridCell.x + cos(angle) * distance;
      let py = gridCell.y + sin(angle) * distance;
      gridCell.cluster.push({
        x: px,
        y: py
      });
    }
  }
}

function draw() {
  background(0, 0, 5, 1);
  
  // Clear grid
  let cols = ceil(width / gridSize);
  let rows = ceil(height / gridSize);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = [];
    }
  }
  
  // Update and draw pixel clusters
  for (let cell of hexGrid) {
    cell.pulsePhase += 0.05;
    
    let pulse = sin(cell.pulsePhase) * 0.3 + 0.7;
    let bright = 80 + pulse * 20;
    
    // Draw cluster
    noStroke();
    fill(cell.hue, 100, bright, 0.9);
    for (let p of cell.cluster) {
      ellipse(p.x, p.y, cell.size * pulse);
    }
    
    // Spatial hash
    let col = floor(cell.x / gridSize);
    let row = floor(cell.y / gridSize);
    if (col >= 0 && col < cols && row >= 0 && row < rows) {
      grid[col][row].push(cell);
    }
  }
  
  // Draw hexagonal modules
  for (let mod of modules) {
    mod.pulsePhase += 0.03;
    
    let pulse = sin(mod.pulsePhase) * 0.3 + 0.7;
    let bright = 80 + pulse * 20;
    
    // Draw module body
    noStroke();
    fill(mod.hue, 100, bright, 0.4);
    ellipse(mod.x, mod.y, gridSize * pulse);
    
    // Draw inner glow
    fill(mod.hue, 100, 95, 0.6);
    ellipse(mod.x, mod.y, gridSize * 0.4 * pulse);
    
    // Spatial hash
    let col = floor(mod.x / gridSize);
    let row = floor(mod.y / gridSize);
    if (col >= 0 && col < cols && row >= 0 && row < rows) {
      grid[col][row].push(mod);
    }
  }
  
  // Draw connections between modules
  stroke(200, 100, 90, 0.1);
  strokeWeight(1);
  for (let mod of modules) {
    let col = floor(mod.x / gridSize);
    let row = floor(mod.y / gridSize);
    
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        let nc = col + dx;
        let nr = row + dy;
        
        if (nc >= 0 && nc < cols && nr >= 0 && nr < rows) {
          for (let other of grid[nc][nr]) {
            if (other !== mod && other.connections !== undefined) { // Only connect modules
              let d = dist(mod.x, mod.y, other.x, other.y);
              if (d < gridSize * 2.5) {
                line(mod.x, mod.y, other.x, other.y);
              }
            }
          }
        }
      }
    }
  }
  
  // Draw energy waves
  for (let i = waves.length - 1; i >= 0; i--) {
    let wave = waves[i];
    wave.radius += wave.speed;
    
    if (wave.radius > width) {
      waves.splice(i, 1);
      continue;
    }
    
    let alpha = map(wave.radius, 0, width, 0.5, 0);
    stroke(wave.hue, 100, 90, alpha);
    noFill();
    ellipse(wave.x, wave.y, wave.radius * 2);
  }
  
  // Occasionally emit new waves from modules
  if (random() < 0.03) {
    let source = random(modules);
    waves.push({
      x: source.x,
      y: source.y,
      radius: 0,
      speed: random(2, 5),
      hue: source.hue
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
