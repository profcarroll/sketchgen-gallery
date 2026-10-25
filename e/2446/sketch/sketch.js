let nodes = [];
let connections = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  pixelDensity(1);
  
  // Create a dense grid of nodes with random offsets
  const gridSize = 15;
  const nodeCount = (width / gridSize) * (height / gridSize);
  
  for (let i = 0; i < nodeCount; i++) {
    const x = (i % (width / gridSize)) * gridSize + random(gridSize);
    const y = floor(i / (width / gridSize)) * gridSize + random(gridSize);
    
    nodes.push({
      x: x,
      y: y,
      hue: random(20, 60) // Earthy tones
    });
  }
  
  // Create connections between nearby nodes using spatial hashing for performance
  const maxDistance = gridSize * 1.8;
  const grid = {};
  
  // Hash nodes into grid cells
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const cellX = floor(node.x / gridSize);
    const cellY = floor(node.y / gridSize);
    
    if (!grid[cellX]) grid[cellX] = {};
    if (!grid[cellX][cellY]) grid[cellX][cellY] = [];
    grid[cellX][cellY].push(i);
  }
  
  // Connect nodes to neighbors in adjacent cells
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const cellX = floor(node.x / gridSize);
    const cellY = floor(node.y / gridSize);
    
    // Check current and neighboring cells
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const nx = cellX + dx;
        const ny = cellY + dy;
        
        if (grid[nx] && grid[nx][ny]) {
          for (let j = 0; j < grid[nx][ny].length; j++) {
            const otherIndex = grid[nx][ny][j];
            
            // Avoid duplicate connections and self-connections
            if (otherIndex > i) {
              const otherNode = nodes[otherIndex];
              const dx = node.x - otherNode.x;
              const dy = node.y - otherNode.y;
              const distance = sqrt(dx * dx + dy * dy);
              
              if (distance < maxDistance) {
                connections.push({
                  node1: i,
                  node2: otherIndex
                });
                
                // Limit total connections to avoid performance issues
                if (connections.length > 2500) break;
              }
            }
          }
          if (connections.length > 2500) break;
        }
      }
      if (connections.length > 2500) break;
    }
    if (connections.length > 2500) break;
  }
}

function draw() {
  background(0);
  
  // Draw connections with glowing effect
  strokeWeight(0.8);
  for (let i = 0; i < connections.length; i++) {
    const c = connections[i];
    const n1 = nodes[c.node1];
    const n2 = nodes[c.node2];
    
    // Soft pink and blue highlights
    let hue = (n1.hue + frameCount * 0.3) % 360;
    if (hue > 300 || hue < 180) {
      hue = (hue + 240) % 360; // Shift towards blue
    }
    
    stroke(hue, 80, 90, 0.5);
    line(n1.x, n1.y, n2.x, n2.y);
  }
  
  // Draw nodes with subtle pulsing and expanding rings
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    
    // Node core with soft glow
    fill(node.hue, 90, 95, 0.7);
    noStroke();
    ellipse(node.x, node.y, 1.5);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
