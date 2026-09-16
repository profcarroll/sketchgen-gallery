let grid;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  pixelDensity(1);

  // Create a spatial hash for efficient neighbor lookups
  const cellSize = 60;
  const cols = Math.ceil(width / cellSize) + 1;
  const rows = Math.ceil(height / cellSize) + 1;
  grid = new Array(cols * rows).fill(null).map(() => []);

  // Generate initial grid points
  for (let i = 0; i < 2000; i++) {
    const x = random(-width/2, width/2);
    const y = random(-height/2, height/2);
    const z = random(-1000, 1000);
    const point = { x, y, z };
    const col = Math.floor((x + width/2) / cellSize);
    const row = Math.floor((y + height/2) / cellSize);
    if (col >= 0 && col < cols && row >= 0 && row < rows) {
      grid[col + row * cols].push(point);
    }
  }
}

function draw() {
  background(10, 15, 25);

  // Camera movement
  const camX = sin(time * 0.0002) * 500;
  const camY = cos(time * 0.0003) * 500;
  const camZ = 800 + sin(time * 0.0001) * 300;
  camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);

  // Lighting
  pointLight(255, 255, 255, 0, -500, 500);
  ambientLight(60, 80, 100);

  time += 1;

  strokeWeight(1.5);

  // Draw connections between nearby points
  beginShape(LINES);
  for (let col = 0; col < grid.length; col++) {
    const cell = grid[col];
    if (!cell || cell.length === 0) continue;

    const cellX = (col % (width / 60)) * 60 - width/2;
    const cellY = Math.floor(col / (width / 60)) * 60 - height/2;

    for (let i = 0; i < cell.length; i++) {
      const p1 = cell[i];
      const x1 = p1.x;
      const y1 = p1.y;
      const z1 = p1.z;

      // Check neighbors in nearby cells
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const neighborCol = col + dx + dy * (width / 60);
          if (neighborCol < 0 || neighborCol >= grid.length) continue;

          const neighbors = grid[neighborCol];
          if (!neighbors) continue;

          for (let j = 0; j < neighbors.length; j++) {
            const p2 = neighbors[j];
            const x2 = p2.x;
            const y2 = p2.y;
            const z2 = p2.z;

            // Distance squared
            const dx2 = x1 - x2;
            const dy2 = y1 - y2;
            const dz2 = z1 - z2;
            const distSq = dx2 * dx2 + dy2 * dy2 + dz2 * dz2;

            if (distSq < 10000 && distSq > 1) {
              // Color based on distance
              const alpha = map(distSq, 1, 10000, 255, 50);
              stroke(100, 150, 200, alpha);

              vertex(x1, y1, z1);
              vertex(x2, y2, z2);
            }
          }
        }
      }

      // Draw connections to points in same cell
      for (let j = i + 1; j < cell.length; j++) {
        const p2 = cell[j];
        const x2 = p2.x;
        const y2 = p2.y;
        const z2 = p2.z;

        const dx2 = x1 - x2;
        const dy2 = y1 - y2;
        const dz2 = z1 - z2;
        const distSq = dx2 * dx2 + dy2 * dy2 + dz2 * dz2;

        if (distSq < 3000 && distSq > 1) {
          stroke(200, 180, 160, map(distSq, 1, 3000, 255, 50));
          vertex(x1, y1, z1);
          vertex(x2, y2, z2);
        }
      }
    }
  }
  endShape();

  // Draw points
  strokeWeight(2);
  beginShape(POINTS);
  for (let col = 0; col < grid.length; col++) {
    const cell = grid[col];
    if (!cell || cell.length === 0) continue;

    for (let i = 0; i < cell.length; i++) {
      const p = cell[i];
      const x = p.x;
      const y = p.y;
      const z = p.z;

      // Color based on position and time
      const hue = (time * 0.1 + x * 0.01 + y * 0.01) % 360;
      const sat = 50 + sin(time * 0.01 + x * 0.01) * 20;
      const bright = 70 + cos(time * 0.01 + y * 0.01) * 20;

      fill(hue, sat, bright);
      noStroke();

      vertex(x, y, z);
    }
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
