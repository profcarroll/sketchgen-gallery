let grid = [];
let gridSize = 20;
let cellSize = 40;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  colorMode(HSB, 1);

  // Create a spatial hash grid for efficient neighbor lookups
  let cols = ceil(width / gridSize);
  let rows = ceil(height / gridSize);
  grid = new Array(cols * rows).fill(null).map(() => []);

  // Initialize particles in the grid
  for (let i = 0; i < 500; i++) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let z = random(-300, 300);
    let particle = {x, y, z};
    let col = floor((x + width/2) / gridSize);
    let row = floor((y + height/2) / gridSize);
    if (col >= 0 && col < cols && row >= 0 && row < rows) {
      grid[row * cols + col].push(particle);
    }
  }

  frameRate(30);
}

function draw() {
  background(0);
  time += 0.02;

  // Camera movement for immersive effect
  let cx = sin(time * 0.1) * 200;
  let cy = cos(time * 0.15) * 100;
  let cz = sin(time * 0.05) * 300;
  camera(0, 0, cz, cx, cy, 0, 0, 1, 0);

  // Draw pulsating emerald green light network
  drawNetwork();

  // Draw tessellating crystalline reflections
  drawReflections();
}

function drawNetwork() {
  let hue = 0.33; // Emerald green
  let sat = 1;
  let bright = 1;

  beginShape(LINES);
  for (let i = 0; i < grid.length; i++) {
    if (grid[i].length === 0) continue;

    let col = i % ceil(width / gridSize);
    let row = floor(i / ceil(width / gridSize));

    // Connect to neighbors
    let connections = 0;
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;

        let nx = col + dx;
        let ny = row + dy;
        if (nx >= 0 && nx < ceil(width / gridSize) && ny >= 0 && ny < ceil(height / gridSize)) {
          let neighborIndex = ny * ceil(width / gridSize) + nx;
          if (grid[neighborIndex].length > 0 && connections < 4) {
            let p1 = grid[i][0];
            let p2 = grid[neighborIndex][0];

            // Calculate distance for pulse effect
            let d = dist(p1.x, p1.y, p2.x, p2.y);
            let pulse = sin(time * 3 + d * 0.01) * 0.5 + 0.5;

            // Set color with pulsing intensity
            fill(hue, sat, bright * pulse);
            stroke(hue, sat, bright * pulse);

            vertex(p1.x, p1.y, p1.z);
            vertex(p2.x, p2.y, p2.z);
            connections++;
          }
        }
      }
    }

    // Connect to self for a central glow
    let p = grid[i][0];
    let pulse = sin(time * 3 + p.x * 0.01 + p.y * 0.01) * 0.5 + 0.5;
    fill(hue, sat, bright * pulse);
    stroke(hue, sat, bright * pulse);
    vertex(p.x, p.y, p.z);
    vertex(p.x, p.y, p.z + 20);
  }
  endShape();
}

function drawReflections() {
  let hue = 0.5; // Blue
  let sat = 0.8;
  let bright = 1;

  for (let i = 0; i < grid.length; i++) {
    if (grid[i].length === 0) continue;

    let col = i % ceil(width / gridSize);
    let row = floor(i / ceil(width / gridSize));

    // Draw crystalline reflections
    let p = grid[i][0];
    let pulse = sin(time * 4 + p.x * 0.01 + p.y * 0.01) * 0.5 + 0.5;

    push();
    translate(p.x, p.y, p.z);
    rotateX(time * 0.2 + p.x * 0.001);
    rotateY(time * 0.3 + p.y * 0.001);
    rotateZ(time * 0.1 + p.z * 0.001);

    // Draw tessellated reflection geometry
    let size = 5 + pulse * 10;
    fill(hue, sat, bright * pulse);
    stroke(hue, sat, bright * pulse);

    // Draw a small cube to simulate crystalline structure
    box(size);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
