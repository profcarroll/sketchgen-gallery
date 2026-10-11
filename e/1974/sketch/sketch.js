let roots = [];
let particles = [];
let grid = [];
let cellSize = 40;
let rows, cols;

function setup() {
  createCanvas(800, 600);
  pixelDensity(1);
  
  rows = ceil(height / cellSize);
  cols = ceil(width / cellSize);
  grid = new Array(rows);
  for (let i = 0; i < rows; i++) {
    grid[i] = new Array(cols).fill().map(() => []);
  }

  // Generate root system
  for (let i = 0; i < 1500; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(2, 6);
    let isCrystallized = random() > 0.7;
    roots.push({ x, y, size, isCrystallized });
    
    let col = floor(x / cellSize);
    let row = floor(y / cellSize);
    if (col >= 0 && col < cols && row >= 0 && row < rows) {
      grid[row][col].push(roots.length - 1);
    }
  }

  // Generate particles for glow effect
  for (let i = 0; i < 3000; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(0.5, 2);
    particles.push({ x, y, size });
  }
}

function draw() {
  background(20);

  // Draw root connections
  for (let root of roots) {
    let col = floor(root.x / cellSize);
    let row = floor(root.y / cellSize);
    
    if (col >= 0 && col < cols && row >= 0 && row < rows) {
      let neighbors = [];
      
      // Check nearby cells
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          let nx = col + dx;
          let ny = row + dy;
          if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
            for (let idx of grid[ny][nx]) {
              let other = roots[idx];
              let d = dist(root.x, root.y, other.x, other.y);
              if (d < 80 && d > 1) neighbors.push({ idx, d });
            }
          }
        }
      }

      // Sort by distance and draw connections
      neighbors.sort((a, b) => a.d - b.d);
      stroke(150, 60);
      noFill();
      
      for (let j = 0; j < min(4, neighbors.length); j++) {
        let n = neighbors[j];
        if (n.idx !== roots.indexOf(root)) {
          line(root.x, root.y, roots[n.idx].x, roots[n.idx].y);
        }
      }

      // Draw crystallized roots with glow
      if (root.isCrystallized) {
        noStroke();
        
        // Create radial gradient glow
        let gradient = drawingContext.createRadialGradient(
          root.x, root.y, 0,
          root.x, root.y, root.size * 3
        );
        gradient.addColorStop(0, color(255, 200, 100, 200));
        gradient.addColorStop(1, color(255, 100, 50, 0));

        drawingContext.fillStyle = gradient;
        ellipse(root.x, root.y, root.size * 3);
        
        // Draw core
        fill(255, 180, 100);
        noStroke();
        ellipse(root.x, root.y, root.size);
      }
    }
  }

  // Draw background particles for depth
  for (let particle of particles) {
    let alpha = map(particle.size, 0.5, 2, 30, 100);
    fill(100, alpha);
    noStroke();
    ellipse(particle.x, particle.y, particle.size);
  }
}
