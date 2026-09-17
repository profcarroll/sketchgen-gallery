let gridPoints = [];
let connections = [];
let flowOffset = 0;
let nodePositions = [];
let shouldRecalculate = false;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 1);

  // Initialize grid points
  for (let i = 0; i < 500; i++) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let z = random(-100, 100);
    gridPoints.push({x, y, z});
  }

  // Initialize nodes
  for (let i = 0; i < 8; i++) {
    nodePositions.push({
      x: random(-width/3, width/3),
      y: random(-height/3, height/3),
      z: random(-100, 100)
    });
  }

  // Precompute connections
  for (let i = 0; i < gridPoints.length; i++) {
    for (let j = i + 1; j < gridPoints.length; j++) {
      if (dist(gridPoints[i].x, gridPoints[i].y, gridPoints[i].z,
               gridPoints[j].x, gridPoints[j].y, gridPoints[j].z) < 100) {
        connections.push([i, j]);
      }
    }
  }
}

function draw() {
  background(0);
  noStroke();

  // Camera movement
  let time = millis() * 0.0005;
  camera(
    sin(time) * width/2,
    sin(time * 0.7) * height/3,
    cos(time) * width/2 + 500,
    0, 0, 0,
    0, 1, 0
  );

  // Flow effect
  flowOffset += 0.01;

  // Update grid points
  for (let i = 0; i < gridPoints.length; i++) {
    let p = gridPoints[i];
    let nodeForce = {x: 0, y: 0, z: 0};

    // Apply forces from nodes
    for (let node of nodePositions) {
      let dx = node.x - p.x;
      let dy = node.y - p.y;
      let dz = node.z - p.z;
      let dist = sqrt(dx*dx + dy*dy + dz*dz);
      
      if (dist < 200 && dist > 1) {
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

  // Draw connections
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

  // Draw points
  noStroke();
  for (let p of gridPoints) {
    let intensity = noise(p.x * 0.01, p.y * 0.01, p.z * 0.01 + flowOffset) * 0.5 + 0.5;
    fill(intensity * 255, 255, 255, 180);
    sphere(2, 3, 2);
  }

  // Draw nodes
  noStroke();
  for (let node of nodePositions) {
    fill(255, 100, 255, 100);
    sphere(20, 6, 4);
  }

  if (shouldRecalculate) {
    recalculateGrid();
    shouldRecalculate = false;
  }
}

function mousePressed() {
  shouldRecalculate = true;
}

function recalculateGrid() {
  // Reset node positions
  for (let i = 0; i < nodePositions.length; i++) {
    nodePositions[i] = {
      x: random(-width/3, width/3),
      y: random(-height/3, height/3),
      z: random(-100, 100)
    };
  }

  // Reconnect points
  connections = [];
  for (let i = 0; i < gridPoints.length; i++) {
    for (let j = i + 1; j < gridPoints.length; j++) {
      if (dist(gridPoints[i].x, gridPoints[i].y, gridPoints[i].z,
               gridPoints[j].x, gridPoints[j].y, gridPoints[j].z) < 100) {
        connections.push([i, j]);
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
