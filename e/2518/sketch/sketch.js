let nodes = [];
let beams = [];
const numNodes = 150;
const numBeams = 400;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Generate nodes
  for (let i = 0; i < numNodes; i++) {
    let pos = p5.Vector.random3D().mult(random(200, 800));
    nodes.push({
      pos: pos,
      basePos: pos.copy(),
      pulse: random(TWO_PI),
      pulseSpeed: random(0.01, 0.03),
      size: random(1, 3)
    });
  }
  
  // Generate beams between nearby nodes
  for (let i = 0; i < numBeams; i++) {
    let a = floor(random(nodes.length));
    let b = floor(random(nodes.length));
    
    // Ensure a and b are different
    if (a === b) b = (b + 1) % nodes.length;
    
    beams.push({
      a: a,
      b: b,
      length: p5.Vector.dist(nodes[a].pos, nodes[b].pos),
      baseLength: p5.Vector.dist(nodes[a].basePos, nodes[b].basePos)
    });
  }
}

function draw() {
  background(220, 10, 95);
  
  // Apply pulsation to nodes
  for (let node of nodes) {
    node.pulse += node.pulseSpeed;
    let pulseFactor = sin(node.pulse) * 0.2 + 0.8;
    
    // Apply pulse to position
    node.pos = p5.Vector.lerp(
      node.basePos,
      node.basePos.copy().add(p5.Vector.random3D().mult(10)),
      pulseFactor * 0.3
    );
  }
  
  // Draw beams with distortion effect and color flow
  noFill();
  beginShape(LINES);
  
  for (let beam of beams) {
    let nodeA = nodes[beam.a];
    let nodeB = nodes[beam.b];
    
    // Calculate distortion factor from pulse
    let dist = p5.Vector.dist(nodeA.pos, nodeB.pos);
    let distortion = map(dist, beam.baseLength * 0.7, beam.baseLength * 1.3, 0, 1, true);
    
    if (distortion > 0) {
      // Color based on position and time for chromatic flow
      let hue = (frameCount * 0.2 + nodeA.pos.x * 0.01 + nodeA.pos.y * 0.01) % 360;
      stroke(hue, 70, 85, 0.6);
      
      // Draw distorted line
      vertex(nodeA.pos.x, nodeA.pos.y, nodeA.pos.z);
      vertex(nodeB.pos.x, nodeB.pos.y, nodeB.pos.z);
    }
  }
  
  endShape();
  
  // Draw nodes with pulsation and chromatic flow
  for (let node of nodes) {
    let pulseFactor = sin(node.pulse) * 0.3 + 0.7;
    
    push();
    translate(node.pos.x, node.pos.y, node.pos.z);
    noStroke();
    
    // Node color flows with the overall chromatic field
    let hue = (frameCount * 0.1 + node.pos.x * 0.02) % 360;
    fill(hue, 80, 90, 0.7);
    
    sphere(node.size * pulseFactor, 4, 3);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
