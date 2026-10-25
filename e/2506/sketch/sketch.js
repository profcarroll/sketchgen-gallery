let mycelium;
let tileGrid;
const tileSize = 80;
const gridWidth = 15;
const gridHeight = 15;
const nodeCount = 500;
const connectionCount = 2000;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create ceramic tile grid
  tileGrid = [];
  for (let y = 0; y < gridHeight; y++) {
    tileGrid[y] = [];
    for (let x = 0; x < gridWidth; x++) {
      tileGrid[y][x] = {
        x: (x - gridWidth/2) * tileSize,
        y: (y - gridHeight/2) * tileSize,
        z: 0,
        color: color(20, 15, 30)
      };
    }
  }
  
  // Create mycelium network
  mycelium = {
    nodes: [],
    connections: []
  };
  
  // Create nodes
  for (let i = 0; i < nodeCount; i++) {
    const x = random(-width/2 + 100, width/2 - 100);
    const y = random(-height/2 + 100, height/2 - 100);
    const z = random(-50, 50);
    
    mycelium.nodes.push({
      x: x,
      y: y,
      z: z,
      size: random(2, 6),
      color: color(random(180, 240), 70, 80, 0.8),
      pulse: random(TWO_PI),
      pulseSpeed: random(0.01, 0.03),
      connections: []
    });
  }
  
  // Create connections between nodes using spatial hashing for performance
  const gridSize = 120;
  const grid = [];
  
  for (let i = 0; i < mycelium.nodes.length; i++) {
    const node = mycelium.nodes[i];
    const gridX = floor((node.x + width/2) / gridSize);
    const gridY = floor((node.y + height/2) / gridSize);
    
    if (!grid[gridX]) grid[gridX] = [];
    if (!grid[gridX][gridY]) grid[gridX][gridY] = [];
    
    grid[gridX][gridY].push(node);
  }
  
  // Connect nearby nodes
  for (let i = 0; i < connectionCount && mycelium.connections.length < connectionCount; i++) {
    const nodeA = mycelium.nodes[floor(random(mycelium.nodes.length))];
    let nodeB;
    
    // Find a nearby node
    let found = false;
    let attempts = 0;
    while (!found && attempts < 50) {
      attempts++;
      const gridX = floor((nodeA.x + width/2) / gridSize);
      const gridY = floor((nodeA.y + height/2) / gridSize);
      
      const nearbyGridX = gridX + floor(random(-2, 3));
      const nearbyGridY = gridY + floor(random(-2, 3));
      
      if (grid[nearbyGridX] && grid[nearbyGridX][nearbyGridY] && grid[nearbyGridX][nearbyGridY].length > 0) {
        nodeB = random(grid[nearbyGridX][nearbyGridY]);
        if (nodeA !== nodeB && !nodeA.connections.includes(nodeB)) {
          // Connect A to B and B to A
          nodeA.connections.push(nodeB);
          nodeB.connections.push(nodeA);
          
          mycelium.connections.push({
            from: nodeA,
            to: nodeB,
            intensity: random(0.3, 0.7)
          });
          found = true;
        }
      }
    }
  }
  
  // Set up lighting
  ambientLight(20);
  pointLight(255, 255, 255, 0, 0, 100);
}

function draw() {
  background(0);
  
  // Slow rotation
  rotateY(frameCount * 0.001);
  rotateX(frameCount * 0.0005);
  
  // Draw ceramic tiles
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      push();
      translate(tileGrid[y][x].x, tileGrid[y][x].y, tileGrid[y][x].z);
      
      noStroke();
      fill(tileGrid[y][x].color);
      plane(tileSize - 2, tileSize - 2);
      
      pop();
    }
  }
  
  // Draw mycelium network
  beginShape(LINES);
  for (let connection of mycelium.connections) {
    const nodeA = connection.from;
    const nodeB = connection.to;
    
    // Update pulse for both nodes
    nodeA.pulse += nodeA.pulseSpeed;
    nodeB.pulse += nodeB.pulseSpeed;
    
    // Calculate pulsing intensity
    const pulseA = sin(nodeA.pulse) * 0.5 + 0.5;
    const pulseB = sin(nodeB.pulse) * 0.5 + 0.5;
    const avgPulse = (pulseA + pulseB) / 2;
    
    // Draw connection line
    const colorVal = lerpColor(nodeA.color, nodeB.color, 0.5);
    stroke(colorVal);
    strokeWeight(connection.intensity * 1.5 * avgPulse);
    
    vertex(nodeA.x, nodeA.y, nodeA.z);
    vertex(nodeB.x, nodeB.y, nodeB.z);
  }
  endShape();
  
  // Draw nodes as points
  beginShape(POINTS);
  for (let node of mycelium.nodes) {
    const pulse = sin(node.pulse) * 0.5 + 0.5;
    const glow = pulse * 0.7;
    
    fill(node.color);
    fill(red(node.color), green(node.color), blue(node.color), glow);
    
    vertex(node.x, node.y, node.z);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
