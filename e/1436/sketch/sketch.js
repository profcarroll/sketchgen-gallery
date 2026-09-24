let circuits = [];
let connections = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Create a grid of circuit nodes
  const gridSize = 20;
  const spacing = width / (gridSize + 1);
  
  for (let i = 0; i < gridSize; i++) {
    circuits[i] = [];
    for (let j = 0; j < gridSize; j++) {
      circuits[i][j] = {
        x: spacing * (i + 1),
        y: spacing * (j + 1),
        pulse: random(1),
        connections: []
      };
    }
  }
  
  // Connect nodes to create a lattice structure
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (i < gridSize - 1) circuits[i][j].connections.push(circuits[i + 1][j]);
      if (j < gridSize - 1) circuits[i][j].connections.push(circuits[i][j + 1]);
      if (i > 0 && j > 0) circuits[i][j].connections.push(circuits[i - 1][j - 1]);
      if (i < gridSize - 1 && j > 0) circuits[i][j].connections.push(circuits[i + 1][j - 1]);
    }
  }
  
  // Flatten connections for drawing
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      for (let conn of circuits[i][j].connections) {
        connections.push({
          from: circuits[i][j],
          to: conn,
          intensity: 0
        });
      }
    }
  }
}

function draw() {
  background(10, 10, 20);
  
  time += 0.02;
  
  // Update pulse values for each circuit node
  for (let i = 0; i < circuits.length; i++) {
    for (let j = 0; j < circuits[i].length; j++) {
      circuits[i][j].pulse = sin(time + i * 0.1 + j * 0.1) * 0.5 + 0.5;
    }
  }
  
  // Update connection intensities
  for (let conn of connections) {
    const avgPulse = (conn.from.pulse + conn.to.pulse) / 2;
    conn.intensity = map(avgPulse, 0, 1, 0.2, 1);
  }
  
  // Draw connections with varying glow intensity
  for (let conn of connections) {
    const alpha = map(conn.intensity, 0, 1, 30, 150);
    
    push();
    stroke(100, 200, 255, alpha);
    strokeWeight(1 + conn.intensity * 2);
    line(conn.from.x, conn.from.y, conn.to.x, conn.to.y);
    pop();
  }
  
  // Draw circuit nodes with pulsing glow
  for (let i = 0; i < circuits.length; i++) {
    for (let j = 0; j < circuits[i].length; j++) {
      const node = circuits[i][j];
      const pulse = node.pulse;
      
      push();
      fill(255, 255, 255, 100 + pulse * 155);
      noStroke();
      ellipse(node.x, node.y, 8 + pulse * 6, 8 + pulse * 6);
      pop();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
