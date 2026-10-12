let gridPoints = [];
let connections = [];
let flowOffset = 0;
let nodePositions = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 1);

  // Create concrete grid structure
  for (let i = 0; i < 600; i++) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let z = random(-150, 150);
    gridPoints.push({x, y, z});
  }

  // Initialize nodes at key points
  for (let i = 0; i < 4; i++) {
    nodePositions.push({
      x: random(-width/3, width/3),
      y: random(-height/3, height/3),
      z: random(-150, 150)
    });
  }

  // Precompute connections with spatial hashing for efficiency
  let gridSize = 100;
  let grid = {};
  
  for (let i = 0; i < gridPoints.length; i++) {
    let p = gridPoints[i];
    let gridX = Math.floor(p.x / gridSize);
    let gridY = Math.floor(p.y / gridSize);
    let gridZ = Math.floor(p.z / gridSize);
    
    if (!grid[`${gridX},${gridY},${gridZ}`]) {
      grid[`${gridX},${gridY},${gridZ}`] = [];
    }
    grid[`${gridX},${gridY},${gridZ}`].push(i);
  }

  // Connect points within grid cells and neighboring cells
  for (let i = 0; i < gridPoints.length; i++) {
    let p1 = gridPoints[i];
    let gridX = Math.floor(p1.x / gridSize);
    let gridY = Math.floor(p1.y / gridSize);
    let gridZ = Math.floor(p1.z / gridSize);
    
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dz = -1; dz <= 1; dz++) {
          let key = `${gridX + dx},${gridY + dy},${gridZ + dz}`;
          if (grid[key]) {
            for (let j of grid[key]) {
              if (i < j) { // Avoid duplicate connections
                let p2 = gridPoints[j];
                let dx = p1.x - p2.x;
                let dy = p1.y - p2.y;
                let dz = p1.z - p2.z;
                let distanceSquared = dx*dx + dy*dy + dz*dz;
                
                if (distanceSquared < 10000) { // 100 squared
                  connections.push([i, j]);
                }
              }
            }
          }
        }
      }
    }
  }
}

function draw() {
  background(0);
  noStroke();

  // Camera movement to explore the space
  let time = millis() * 0.0002;
  camera(
    sin(time) * width/2,
    sin(time * 0.7) * height/3,
    cos(time) * width/2 + 500,
    0, 0, 0,
    0, 1, 0
  );

  // Flow effect
  flowOffset += 0.02;

  // Update grid points with organic movement
  for (let i = 0; i < gridPoints.length; i++) {
    let p = gridPoints[i];
    let nodeForce = {x: 0, y: 0, z: 0};

    // Apply forces from nodes
    for (let node of nodePositions) {
      let dx = node.x - p.x;
      let dy = node.y - p.y;
      let dz = node.z - p.z;
      let distSquared = dx*dx + dy*dy + dz*dz;
      
      if (distSquared < 40000 && distSquared > 1) { // 200 squared
        let dist = sqrt(distSquared);
        let force = map(dist, 1, 200, 5, 0.1);
        nodeForce.x += dx * force * 0.001;
        nodeForce.y += dy * force * 0.001;
        nodeForce.z += dz * force * 0.001;
      }
    }

    // Apply flow
    p.x += sin(p.z * 0.01 + flowOffset) * 0.5 + nodeForce.x;
    p.y += cos(p.z * 0.01 + flowOffset) * 0.5 + nodeForce.y;
    p.z += sin(p.x * 0.01 + flowOffset) * 0.5 + nodeForce.z;

    // Wrap around edges
    if (p.x > width/2 + 50) p.x = -width/2 - 50;
    if (p.x < -width/2 - 50) p.x = width/2 + 50;
    if (p.y > height/2 + 50) p.y = -height/2 - 50;
    if (p.y < -height/2 - 50) p.y = height/2 + 50;
  }

  // Draw connections with subtle glow effect
  stroke(255, 0.1);
  strokeWeight(0.5);
  beginShape(LINES);
  for (let conn of connections) {
    let a = gridPoints[conn[0]];
    let b = gridPoints[conn[1]];
    vertex(a.x, a.y, a.z);
    vertex(b.x, b.y, b.z);
  }
  endShape();

  // Draw points with bioluminescent effect
  noStroke();
  beginShape(POINTS);
  for (let i = 0; i < gridPoints.length; i++) {
    let p = gridPoints[i];
    let intensity = noise(p.x * 0.01, p.y * 0.01, p.z * 0.01 + flowOffset) * 0.5 + 0.5;
    
    // Create bioluminescent color effect
    let hue = (time * 0.1 + intensity * 0.3) % 1;
    fill(hue, 0.8, 1, 0.8);
    
    vertex(p.x, p.y, p.z);
  }
  endShape();

  // Draw nodes with pulsing bioluminescence
  noStroke();
  for (let node of nodePositions) {
    let hue = (time * 0.2 + 0.5) % 1;
    let pulse = sin(time * 3) * 0.2 + 0.8;
    fill(hue, 1, 1, 0.7 * pulse);
    push();
    translate(node.x, node.y, node.z);
    sphere(20, 6, 4);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
