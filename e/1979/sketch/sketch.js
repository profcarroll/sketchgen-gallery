let pipes = [];
let lightPosition;
let lightRadius;
let flashIntensity;
let flashTimer;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  // Initialize light at center top
  lightPosition = createVector(0, 0);
  lightRadius = width * 0.4;
  flashIntensity = 0;
  flashTimer = 0;

  // Create a complex network of brass pipes and glass tubing
  generatePipes();
}

function draw() {
  background(20, 20, 30); // Dark blue-gray field

  // Draw the architectural installation
  drawInstallation();

  // Update and draw light
  updateLight();
  drawLight();
}

function generatePipes() {
  // Create a grid of interconnected pipes
  const gridSize = 15;
  const pipeSpacing = width / gridSize;
  const pipeRadius = pipeSpacing * 0.3;

  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      if (random() > 0.3) { // Randomly place pipes
        const posX = (x - gridSize/2) * pipeSpacing;
        const posY = (y - gridSize/2) * pipeSpacing;
        pipes.push({
          x: posX,
          y: posY,
          z: random(-50, 50),
          radius: pipeRadius,
          connections: []
        });
      }
    }
  }

  // Connect pipes to nearby neighbors using a spatial hash
  const grid = {};
  const cellSize = pipeSpacing * 1.5;

  for (let i = 0; i < pipes.length; i++) {
    const pipe = pipes[i];
    const gridX = Math.floor(pipe.x / cellSize);
    const gridY = Math.floor(pipe.y / cellSize);
    const key = `${gridX},${gridY}`;
    
    if (!grid[key]) grid[key] = [];
    grid[key].push(i);
  }

  // For each pipe, check neighbors in adjacent cells
  for (let i = 0; i < pipes.length; i++) {
    const pipe = pipes[i];
    const gridX = Math.floor(pipe.x / cellSize);
    const gridY = Math.floor(pipe.y / cellSize);
    
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const key = `${gridX + dx},${gridY + dy}`;
        if (grid[key]) {
          for (let j of grid[key]) {
            if (i !== j) {
              const otherPipe = pipes[j];
              const d = dist(pipe.x, pipe.y, otherPipe.x, otherPipe.y);
              if (d < pipeSpacing * 1.5 && random() > 0.7) {
                pipe.connections.push(j);
              }
            }
          }
        }
      }
    }
  }
}

function drawInstallation() {
  // Draw the brass pipes and glass tubing
  stroke(200, 180, 120); // Brass color
  strokeWeight(3);
  noFill();

  // Batch all connections into one shape for performance
  beginShape(LINES);
  for (let i = 0; i < pipes.length; i++) {
    const pipe = pipes[i];
    for (let j = 0; j < pipe.connections.length; j++) {
      const targetPipe = pipes[pipe.connections[j]];
      vertex(pipe.x, pipe.y, pipe.z);
      vertex(targetPipe.x, targetPipe.y, targetPipe.z);
    }
  }
  endShape();

  // Draw main pipe spheres
  noStroke();
  for (let i = 0; i < pipes.length; i++) {
    const pipe = pipes[i];
    push();
    translate(pipe.x, pipe.y, pipe.z);
    fill(200, 180, 120, 150); // Brass color with transparency
    sphere(pipe.radius * 0.8, 6, 4); // Reduced detail for performance
    pop();
  }

  // Draw structural elements
  stroke(150, 130, 80);
  strokeWeight(2);
  for (let i = 0; i < pipes.length; i++) {
    const pipe = pipes[i];
    push();
    translate(pipe.x, pipe.y, pipe.z);
    sphere(pipe.radius * 0.5, 6, 4); // Reduced detail
    pop();
  }
}

function updateLight() {
  flashTimer += 0.05;
  // Smooth pulsing effect for the light
  flashIntensity = map(sin(flashTimer), -1, 1, 0.3, 0.8);
}

function drawLight() {
  // Draw a glowing cyan light that pulses rhythmically
  noStroke();
  fill(0, 255, 255, 50 * flashIntensity); // Cyan with transparency

  // Draw the main light core
  push();
  translate(lightPosition.x, lightPosition.y);
  sphere(30, 6, 4); // Reduced detail for performance
  pop();

  // Add a pulsing glow effect
  fill(0, 255, 255, 30 * flashIntensity);
  for (let i = 0; i < 5; i++) {
    const pulse = sin(flashTimer * 3 + i) * 0.3 + 0.7;
    push();
    translate(lightPosition.x, lightPosition.y);
    sphere(40 + i * 10 * pulse, 6, 4); // Reduced detail for performance
    pop();
  }
}
