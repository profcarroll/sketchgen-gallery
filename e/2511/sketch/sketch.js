let nodes = [];
let connections = [];
let isInteractive = false;
let stressPoints = [];
let faultLines = [];

class Node {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.originalX = x;
    this.originalY = y;
    this.originalZ = z;
    this.radius = random(2, 6);
    this.color = color(random(100, 255), random(100, 255), random(100, 255), 200);
    this.isStressed = false;
  }

  draw() {
    push();
    translate(this.x, this.y, this.z);
    noStroke();
    fill(this.color);
    sphere(this.radius, 4, 3);
    pop();
  }
}

class Connection {
  constructor(node1, node2) {
    this.node1 = node1;
    this.node2 = node2;
    this.originalLength = dist(node1.x, node1.y, node1.z, node2.x, node2.y, node2.z);
    this.strength = random(0.8, 1.2);
  }

  draw() {
    const dx = this.node2.x - this.node1.x;
    const dy = this.node2.y - this.node1.y;
    const dz = this.node2.z - this.node1.z;
    const length = dist(this.node1.x, this.node1.y, this.node1.z, this.node2.x, this.node2.y, this.node2.z);
    
    strokeWeight(map(length, 0, 50, 0.5, 2));
    stroke(red(this.node1.color), green(this.node1.color), blue(this.node1.color), 150);
    line(this.node1.x, this.node1.y, this.node1.z, this.node2.x, this.node2.y, this.node2.z);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noLoop();
  
  // Create nodes
  for (let i = 0; i < 150; i++) {
    const x = random(-width/3, width/3);
    const y = random(-height/3, height/3);
    const z = random(-100, 100);
    nodes.push(new Node(x, y, z));
  }
  
  // Create connections
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (dist(nodes[i].x, nodes[i].y, nodes[i].z, nodes[j].x, nodes[j].y, nodes[j].z) < 100) {
        connections.push(new Connection(nodes[i], nodes[j]));
      }
    }
  }
  
  // Add a few extra long-range connections for complexity
  for (let i = 0; i < 30; i++) {
    const n1 = random(nodes);
    let n2;
    do {
      n2 = random(nodes);
    } while (n1 === n2);
    connections.push(new Connection(n1, n2));
  }
  
  // Create fault lines
  for (let i = 0; i < 50; i++) {
    const lineNodes = [];
    let numNodes = floor(random(5, 15));
    let startNode = random(nodes);
    lineNodes.push(startNode);
    
    for (let j = 0; j < numNodes - 1; j++) {
      let nextNode;
      let validNext = false;
      
      // Find a node connected to the last one in our line
      while (!validNext && lineNodes.length > 0) {
        const lastNode = lineNodes[lineNodes.length - 1];
        const candidates = nodes.filter(n => 
          dist(lastNode.x, lastNode.y, lastNode.z, n.x, n.y, n.z) < 80 &&
          !lineNodes.includes(n)
        );
        
        if (candidates.length > 0) {
          nextNode = random(candidates);
          lineNodes.push(nextNode);
          validNext = true;
        } else {
          // If no candidates, break the loop
          break;
        }
      }
    }
    
    faultLines.push(lineNodes);
  }
}

function draw() {
  background(10);
  
  // Camera controls
  rotateX(frameCount * 0.001);
  rotateY(frameCount * 0.002);
  
  // Draw connections first (behind nodes)
  for (let conn of connections) {
    conn.draw();
  }
  
  // Draw fault lines
  strokeWeight(2);
  noFill();
  for (let line of faultLines) {
    if (line.length > 1) {
      beginShape();
      for (let node of line) {
        vertex(node.x, node.y, node.z);
      }
      endShape();
    }
  }
  
  // Draw nodes
  for (let node of nodes) {
    node.draw();
  }
  
  // Draw stress effects
  noStroke();
  for (let point of stressPoints) {
    fill(255, 100, 0, point.life * 100);
    push();
    translate(point.x, point.y, point.z);
    sphere(8, 8, 6);
    pop();
    point.life -= 0.02;
  }
  
  // Remove dead stress points
  stressPoints = stressPoints.filter(p => p.life > 0);
}

function mousePressed() {
  if (!isInteractive) {
    isInteractive = true;
    stimulateNetwork();
    redraw();
  }
}

function stimulateNetwork() {
  // Find the closest node to the click
  let minDist = Infinity;
  let closestNode = null;
  
  for (let node of nodes) {
    const d = dist(mouseX - width/2, mouseY - height/2, node.x, node.y, node.z);
    if (d < minDist) {
      minDist = d;
      closestNode = node;
    }
  }
  
  if (closestNode && minDist < 50) {
    // Mark the node as stressed
    closestNode.isStressed = true;
    
    // Add stress points for visual effect
    stressPoints.push({
      x: closestNode.x,
      y: closestNode.y,
      z: closestNode.z,
      life: 1.0
    });
    
    // Apply subtle movement to connected nodes
    for (let conn of connections) {
      if (conn.node1 === closestNode || conn.node2 === closestNode) {
        const otherNode = (conn.node1 === closestNode) ? conn.node2 : conn.node1;
        otherNode.x += random(-3, 3);
        otherNode.y += random(-3, 3);
        otherNode.z += random(-3, 3);
      }
    }
    
    // Apply movement to nearby nodes
    for (let node of nodes) {
      if (node !== closestNode && dist(closestNode.x, closestNode.y, closestNode.z, node.x, node.y, node.z) < 80) {
        node.x += random(-2, 2);
        node.y += random(-2, 2);
        node.z += random(-2, 2);
      }
    }
    
    // Add stress to fault lines
    for (let line of faultLines) {
      if (line.length > 0 && dist(closestNode.x, closestNode.y, closestNode.z, line[0].x, line[0].y, line[0].z) < 100) {
        // Make a segment glow
        for (let node of line) {
          node.isStressed = true;
        }
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
