let branches = [];
let nodes = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Create initial network structure
  for (let i = 0; i < 150; i++) {
    nodes.push({
      x: random(width),
      y: random(height),
      connections: [],
      size: random(2, 6)
    });
  }
  
  // Connect nodes to form branching structure
  for (let i = 0; i < nodes.length; i++) {
    let node = nodes[i];
    let connectedCount = floor(random(1, 4));
    
    for (let j = 0; j < connectedCount; j++) {
      let targetIndex = floor(random(nodes.length));
      if (targetIndex !== i) {
        node.connections.push(targetIndex);
      }
    }
  }
  
  // Create branches from connections
  for (let i = 0; i < nodes.length; i++) {
    let node = nodes[i];
    for (let targetIndex of node.connections) {
      let targetNode = nodes[targetIndex];
      
      // Create branch with multiple segments
      let segmentCount = floor(random(3, 8));
      let branch = {
        points: [],
        color: color(100, 200, 255, 150),
        thickness: random(0.5, 2)
      };
      
      for (let j = 0; j <= segmentCount; j++) {
        let t = j / segmentCount;
        let x = lerp(node.x, targetNode.x, t);
        let y = lerp(node.y, targetNode.y, t);
        
        // Add some organic movement to branches
        x += random(-3, 3);
        y += random(-3, 3);
        
        branch.points.push(createVector(x, y));
      }
      
      branches.push(branch);
    }
  }
}

function draw() {
  background(10, 5, 15);
  
  time += 0.01;
  
  // Draw branches with subtle pulsing effect
  strokeWeight(1);
  noFill();
  
  for (let branch of branches) {
    // Pulsing color effect
    let pulse = sin(time * 0.5 + branch.points.length * 0.1) * 20;
    let r = red(branch.color) + pulse;
    let g = green(branch.color) + pulse;
    let b = blue(branch.color) + pulse;
    
    stroke(r, g, b, 180);
    strokeWeight(branch.thickness);
    
    beginShape();
    for (let point of branch.points) {
      // Add subtle organic movement to each point
      let offset = sin(time * 0.3 + point.x * 0.01) * 2;
      vertex(point.x + offset, point.y + offset);
    }
    endShape();
  }
  
  // Draw nodes with pulsing effect
  for (let node of nodes) {
    let pulse = sin(time * 0.7 + node.x * 0.01) * 3;
    fill(200, 255, 255, 100);
    noStroke();
    
    ellipse(node.x, node.y, node.size + pulse);
  }
  
  // Occasionally add new connections to simulate growth
  if (frameCount % 120 === 0 && branches.length < 800) {
    let sourceIndex = floor(random(nodes.length));
    let targetIndex = floor(random(nodes.length));
    
    if (sourceIndex !== targetIndex) {
      let sourceNode = nodes[sourceIndex];
      let targetNode = nodes[targetIndex];
      
      let branch = {
        points: [],
        color: color(100, 200, 255, 150),
        thickness: random(0.5, 2)
      };
      
      let segmentCount = floor(random(3, 8));
      for (let j = 0; j <= segmentCount; j++) {
        let t = j / segmentCount;
        let x = lerp(sourceNode.x, targetNode.x, t);
        let y = lerp(sourceNode.y, targetNode.y, t);
        
        // Add some organic movement
        x += random(-3, 3);
        y += random(-3, 3);
        
        branch.points.push(createVector(x, y));
      }
      
      branches.push(branch);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
