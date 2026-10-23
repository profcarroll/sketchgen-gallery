let lattice = [];
const LINE_WEIGHT = 1.5;
const LATTICE_SIZE = 80;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Generate a dense lattice structure
  const spacing = LATTICE_SIZE * 0.7;
  
  for (let y = -spacing; y < height + spacing; y += spacing) {
    for (let x = -spacing; x < width + spacing; x += spacing) {
      // Create a complex, organic-looking node
      const node = {
        x: x,
        y: y,
        connections: []
      };
      
      // Add multiple connection points around the node
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * TWO_PI;
        const distance = random(15, 35);
        const cx = x + cos(angle) * distance;
        const cy = y + sin(angle) * distance;
        
        node.connections.push({
          x: cx,
          y: cy
        });
      }
      
      lattice.push(node);
    }
  }
}

function draw() {
  background(0, 0, 5, 1);
  
  // Draw the organic lattice structure
  for (let i = 0; i < lattice.length; i++) {
    const node = lattice[i];
    
    // Draw connections from this node to others
    const maxConnections = min(6, lattice.length - 1);
    for (let j = 0; j < maxConnections; j++) {
      if (i + j + 1 < lattice.length) {
        const otherNode = lattice[i + j + 1];
        
        // Use warm amber to ochre color palette
        const hue = map(i, 0, lattice.length, 30, 45);
        const sat = map(j, 0, maxConnections, 60, 80);
        const bri = map(i, 0, lattice.length, 65, 90);
        
        stroke(hue, sat, bri, 0.7);
        strokeWeight(LINE_WEIGHT);
        
        // Draw connection lines with slight variation
        line(node.x, node.y, otherNode.x, otherNode.y);
      }
    }
    
    // Draw internal connections within the node
    for (let j = 0; j < node.connections.length; j++) {
      const conn1 = node.connections[j];
      const conn2 = node.connections[(j + 1) % node.connections.length];
      
      const hue = map(i, 0, lattice.length, 35, 50);
      const sat = map(j, 0, node.connections.length, 50, 70);
      const bri = map(i, 0, lattice.length, 70, 95);
      
      stroke(hue, sat, bri, 0.6);
      strokeWeight(LINE_WEIGHT * 0.8);
      
      line(conn1.x, conn1.y, conn2.x, conn2.y);
    }
    
    // Draw central point with warm color
    const hue = map(i, 0, lattice.length, 30, 45);
    const sat = 70;
    const bri = map(i, 0, lattice.length, 80, 95);
    
    fill(hue, sat, bri, 0.8);
    noStroke();
    ellipse(node.x, node.y, 3, 3);
  }
  
  noLoop(); // Static composition
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
