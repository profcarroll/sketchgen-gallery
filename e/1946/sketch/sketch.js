let gridPoints = [];
let connections = [];
let flowOffset = 0;
let nodePositions = [];
let pointCloud = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 1);

  // Initialize grid points
  for (let i = 0; i < 800; i++) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let z = random(-100, 100);
    gridPoints.push({x, y, z});
  }

  // Initialize nodes
  for (let i = 0; i < 6; i++) {
    nodePositions.push({
      x: random(-width/3, width/3),
      y: random(-height/3, height/3),
      z: random(-100, 100)
    });
  }

  // Precompute connections
  for (let i = 0; i < gridPoints.length; i++) {
    for (let j = i + 1; j < gridPoints.length; j++) {
      let dx = gridPoints[i].x - gridPoints[j].x;
      let dy = gridPoints[i].y - gridPoints[j].y;
      let dz = gridPoints[i].z - gridPoints[j].z;
      let distanceSquared = dx*dx + dy*dy + dz*dz;
      
      if (distanceSquared < 10000) { // 100 squared
        connections.push([i, j]);
      }
    }
  }

  // Build point cloud for efficient rendering
  pointCloud = new Array(gridPoints.length);
  for (let i = 0; i < gridPoints.length; i++) {
    pointCloud[i] = {x: gridPoints[i].x, y: gridPoints[i].y, z: gridPoints[i].z};
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

  // Draw points using point cloud
  noStroke();
  beginShape(POINTS);
  for (let i = 0; i < pointCloud.length; i++) {
    let p = pointCloud[i];
    let intensity = noise(p.x * 0.01, p.y * 0.01, p.z * 0.01 + flowOffset) * 0.5 + 0.5;
    
    // Create bioluminescent color effect
    let hue = (time * 0.1 + intensity * 0.3) % 1;
    fill(hue, 0.8, 1, 0.8);
    
    vertex(p.x, p.y, p.z);
  }
  endShape();

  // Draw nodes
  noStroke();
  for (let node of nodePositions) {
    let hue = (time * 0.2 + 0.5) % 1;
    fill(hue, 1, 1, 0.7);
    push();
    translate(node.x, node.y, node.z);
    sphere(20, 6, 4);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
