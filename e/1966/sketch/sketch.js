let nodes = [];
let connections = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();
  strokeWeight(1);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create initial nodal points
  let gridSize = 40;
  for (let x = 0; x < width; x += gridSize) {
    for (let y = 0; y < height; y += gridSize) {
      nodes.push({
        x: x,
        y: y,
        size: random(2, 8),
        angle: random(TWO_PI),
        growth: random(0.01, 0.03)
      });
    }
  }
  
  // Create connections between nearby nodes
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      let d = dist(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
      if (d < 120) {
        connections.push({
          a: i,
          b: j,
          length: d
        });
      }
    }
  }
}

function draw() {
  background(0);
  
  time += 0.02;
  
  // Draw connections with rhythmic expansion
  for (let i = 0; i < connections.length; i++) {
    let c = connections[i];
    let n1 = nodes[c.a];
    let n2 = nodes[c.b];
    
    let d = dist(n1.x, n1.y, n2.x, n2.y);
    let expansion = sin(time * 0.5 + (n1.x + n1.y) * 0.01) * 0.5 + 0.5;
    let length = c.length * (1 + expansion * 0.3);
    
    stroke((time * 10 + (n1.x + n1.y)) % 360, 70, 90, 0.4);
    line(n1.x, n1.y, n2.x, n2.y);
  }
  
  // Draw nodal points and their branches
  for (let i = 0; i < nodes.length; i++) {
    let n = nodes[i];
    
    // Update node position with growth
    n.angle += n.growth;
    n.size = 3 + sin(time * 2 + i) * 2;
    
    push();
    translate(n.x, n.y);
    rotate(n.angle);
    
    // Draw angular dendritic branches
    stroke((time * 5 + i * 10) % 360, 80, 90, 0.8);
    
    // Main branch
    line(0, 0, 0, -n.size * 4);
    
    // Side branches
    let branchCount = floor(random(2, 5));
    for (let j = 0; j < branchCount; j++) {
      let angleOffset = random(-PI/4, PI/4);
      let length = random(n.size * 2, n.size * 6);
      line(0, -n.size * 2, cos(angleOffset) * length, sin(angleOffset) * length - n.size * 2);
    }
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
