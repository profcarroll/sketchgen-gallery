let grid = [];
let cols, rows;
let cellSize = 40;
let time = 0;

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);
  background(0);

  cols = width / cellSize;
  rows = height / cellSize;

  for (let j = 0; j < rows; j++) {
    grid[j] = [];
    for (let i = 0; i < cols; i++) {
      grid[j][i] = {
        x: i * cellSize,
        y: j * cellSize,
        pulse: random(TWO_PI),
        glitch: 0
      };
    }
  }
}

function draw() {
  time += 0.02;

  // Slight background fade for motion trail
  fill(0, 0, 0, 0.1);
  noStroke();
  rect(0, 0, width, height);

  // Draw dynamic grid lines
  strokeWeight(1);
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      let cell = grid[j][i];
      cell.pulse += 0.05;
      cell.glitch = sin(time * 3 + i * 0.1 + j * 0.1) * 0.5 + 0.5;

      // Line brightness based on pulse and glitch
      let bright = map(sin(cell.pulse), -1, 1, 60, 90);
      let alpha = map(sin(time * 2 + i * 0.05), -1, 1, 0.3, 0.8);

      // Horizontal line
      stroke((time * 20 + i * 10) % 360, 100, bright, alpha);
      line(cell.x, cell.y, cell.x + cellSize, cell.y);

      // Vertical line
      stroke((time * 20 + j * 10) % 360, 100, bright, alpha);
      line(cell.x, cell.y, cell.x, cell.y + cellSize);

      // Glitch bursts at random cells
      if (random() < 0.005 * cell.glitch) {
        stroke(255, 100, 100, 0.9);
        strokeWeight(3);
        point(cell.x + cellSize/2, cell.y + cellSize/2);
        strokeWeight(1);
      }

      // Fractal-like connections
      if (i < cols - 1 && j < rows - 1) {
        let nextCell = grid[j][i + 1];
        let downCell = grid[j + 1][i];
        let diagCell = grid[j + 1][i + 1];

        // Draw diagonal lines between cells in a pattern
        if (sin(time * 0.5 + i * 0.1) > 0.7) {
          stroke(200, 100, 80, 0.4);
          line(cell.x, cell.y, diagCell.x + cellSize, diagCell.y + cellSize);
        }

        if (sin(time * 0.5 + j * 0.1) > 0.7) {
          stroke(100, 100, 80, 0.4);
          line(cell.x + cellSize, cell.y, downCell.x, downCell.y + cellSize);
        }
      }

      // Large-scale fractal structure
      if (i % 3 === 0 && j % 3 === 0) {
        let size = cellSize * 1.5;
        stroke(180, 100, 90, 0.2);
        noFill();
        ellipse(cell.x + cellSize/2, cell.y + cellSize/2, size, size);
      }
    }
  }

  // Occasionally flash a large glitch
  if (random() < 0.002) {
    fill(255, 100, 100, 0.3);
    noStroke();
    rect(0, 0, width, height);
  }
}
