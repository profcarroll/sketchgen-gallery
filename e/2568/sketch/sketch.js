let nodes = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noFill();
  
  // Initialize nodes in a dense lattice pattern
  let spacing = 30;
  for (let x = 0; x < width + spacing; x += spacing) {
    for (let y = 0; y < height + spacing; y += spacing) {
      nodes.push({
        x: x,
        y: y,
        baseX: x,
        baseY: y,
        pulse: random(TWO_PI),
        speed: random(0.01, 0.025),
        connections: []
      });
    }
  }
  
  // Precompute connections between nearby nodes
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      let dx = nodes[i].x - nodes[j].x;
      let dy = nodes[i].y - nodes[j].y;
      let distance = sqrt(dx * dx + dy * dy);
      
      if (distance < spacing * 2.5) {
        nodes[i].connections.push(j);
        nodes[j].connections.push(i);
      }
    }
  }
}

function draw() {
  background(20, 10, 95); // Matte plaster tones
  
  time += 0.01;
  
  // Update and draw connections
  stroke(180, 70, 85, 0.7);
  strokeWeight(1);
  
  beginShape(LINES);
  
  for (let i = 0; i < nodes.length; i++) {
    let node = nodes[i];
    
    // Pulsing expansion/contraction
    node.pulse += node.speed;
    let pulse = sin(node.pulse) * 8;
    
    // Angular displacement based on time and node position
    let angle = time * 0.5 + atan2(node.baseY - height/2, node.baseX - width/2);
    let dx = cos(angle) * pulse;
    let dy = sin(angle) * pulse;
    
    node.x = node.baseX + dx;
    node.y = node.baseY + dy;
    
    // Draw connections to nearby nodes
    for (let j = 0; j < min(4, node.connections.length); j++) {
      let otherIndex = node.connections[j];
      if (otherIndex > i) { // Avoid double drawing
        let otherNode = nodes[otherIndex];
        vertex(node.x, node.y);
        vertex(otherNode.x, otherNode.y);
      }
    }
  }
  
  endShape();
  
  // Add central structural pulses
  stroke(160, 60, 80, 0.9);
  strokeWeight(2);
  
  beginShape(LINES);
  for (let i = 0; i < 8; i++) {
    let angle = TWO_PI * i / 8;
    let x1 = width/2 + cos(angle) * 20;
    let y1 = height/2 + sin(angle) * 20;
    let pulse = sin(time * 0.7 + i) * 10;
    let x2 = width/2 + cos(angle) * (40 + pulse);
    let y2 = height/2 + sin(angle) * (40 + pulse);
    
    vertex(x1, y1);
    vertex(x2, y2);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
