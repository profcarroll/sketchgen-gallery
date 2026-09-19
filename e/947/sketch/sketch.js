let lights = [];
let clusters = [];
let grid = [];
let cellSize = 80;
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

  // Generate lights
  for (let i = 0; i < 1500; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(2, 6);
    lights.push({ x, y, size });
    
    let col = floor(x / cellSize);
    let row = floor(y / cellSize);
    if (col >= 0 && col < cols && row >= 0 && row < rows) {
      grid[row][col].push(lights.length - 1);
    }
  }

  // Generate clusters
  for (let i = 0; i < 20; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(30, 70);
    let angle = random(TWO_PI);
    clusters.push({ x, y, size, angle });
  }
}

function draw() {
  background(10);

  // Draw lights
  for (let light of lights) {
    let col = floor(light.x / cellSize);
    let row = floor(light.y / cellSize);
    
    if (col >= 0 && col < cols && row >= 0 && row < rows) {
      let neighbors = [];
      
      // Check nearby cells
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          let nx = col + dx;
          let ny = row + dy;
          if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
            for (let idx of grid[ny][nx]) {
              let other = lights[idx];
              let d = dist(light.x, light.y, other.x, other.y);
              if (d < 100) neighbors.push({ idx, d });
            }
          }
        }
      }

      // Sort by distance and draw connections
      neighbors.sort((a, b) => a.d - b.d);
      stroke(255, 30);
      noFill();
      
      for (let j = 0; j < min(5, neighbors.length); j++) {
        let n = neighbors[j];
        if (n.idx !== lights.indexOf(light)) {
          line(light.x, light.y, lights[n.idx].x, lights[n.idx].y);
        }
      }

      // Draw light itself
      noStroke();
      fill(255, 100);
      ellipse(light.x, light.y, light.size);
    }
  }

  // Draw clusters
  for (let cluster of clusters) {
    let gradient = drawingContext.createRadialGradient(
      cluster.x, cluster.y, 0,
      cluster.x, cluster.y, cluster.size
    );
    gradient.addColorStop(0, color(255, 200));
    gradient.addColorStop(1, color(255, 0));

    drawingContext.fillStyle = gradient;
    noStroke();
    beginShape();
    for (let i = 0; i < 6; i++) {
      let angle = cluster.angle + TWO_PI * i / 6;
      let x = cluster.x + cos(angle) * cluster.size;
      let y = cluster.y + sin(angle) * cluster.size;
      vertex(x, y);
    }
    endShape(CLOSE);

    // Inner glow
    stroke(255, 100);
    noFill();
    beginShape();
    for (let i = 0; i < 6; i++) {
      let angle = cluster.angle + TWO_PI * i / 6;
      let x = cluster.x + cos(angle) * cluster.size * 0.6;
      let y = cluster.y + sin(angle) * cluster.size * 0.6;
      vertex(x, y);
    }
    endShape(CLOSE);
  }

  // Animate cluster rotation
  for (let cluster of clusters) {
    cluster.angle += 0.002;
  }
}
