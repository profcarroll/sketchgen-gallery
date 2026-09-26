let hexGrid = [];
const HEX_RADIUS = 60;
const LINE_WEIGHT = 1;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Generate hexagonal grid points
  const hexHeight = HEX_RADIUS * Math.sqrt(3);
  const hexWidth = HEX_RADIUS * 2;
  
  for (let y = -hexHeight; y < height + hexHeight; y += hexHeight) {
    for (let x = -hexWidth; x < width + hexWidth; x += hexWidth) {
      // Offset every other row
      const offsetX = (y / hexHeight) % 2 === 0 ? HEX_RADIUS : 0;
      const centerX = x + offsetX;
      const centerY = y;
      
      // Store hexagon vertices
      const vertices = [];
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const px = centerX + HEX_RADIUS * Math.cos(angle);
        const py = centerY + HEX_RADIUS * Math.sin(angle);
        vertices.push({x: px, y: py});
      }
      
      hexGrid.push({
        center: {x: centerX, y: centerY},
        vertices: vertices
      });
    }
  }
}

function draw() {
  background(0, 0, 0);
  
  // Draw interwoven lines between hexagons
  for (let i = 0; i < hexGrid.length; i++) {
    const hex1 = hexGrid[i];
    
    // Connect to neighbors in a fixed pattern
    const connections = [
      [0, 2], [1, 3], [2, 4], [3, 5], [4, 0], [5, 1],
      [0, 3], [1, 4], [2, 5], [3, 0], [4, 1], [5, 2]
    ];
    
    for (let j = 0; j < connections.length; j++) {
      const [idx1, idx2] = connections[j];
      
      // Draw line from one vertex to another
      const x1 = hex1.vertices[idx1].x;
      const y1 = hex1.vertices[idx1].y;
      const x2 = hex1.vertices[idx2].x;
      const y2 = hex1.vertices[idx2].y;
      
      // Color with vibrant hue
      const hue = (i * 37) % 360; // Unique color per hexagon
      stroke(hue, 90, 80, 0.8);
      strokeWeight(LINE_WEIGHT);
      line(x1, y1, x2, y2);
    }
    
    // Draw inner connecting lines for complexity
    const innerRadius = HEX_RADIUS * 0.6;
    const innerVertices = [];
    for (let k = 0; k < 6; k++) {
      const angle = (k * Math.PI) / 3;
      const px = hex1.center.x + innerRadius * Math.cos(angle);
      const py = hex1.center.y + innerRadius * Math.sin(angle);
      innerVertices.push({x: px, y: py});
    }
    
    // Connect inner vertices to create a more complex structure
    for (let k = 0; k < 6; k++) {
      const next = (k + 1) % 6;
      const x1 = innerVertices[k].x;
      const y1 = innerVertices[k].y;
      const x2 = innerVertices[next].x;
      const y2 = innerVertices[next].y;
      
      const hue = (i * 37 + 180) % 360;
      stroke(hue, 90, 80, 0.7);
      strokeWeight(LINE_WEIGHT);
      line(x1, y1, x2, y2);
    }
    
    // Connect inner vertices to outer ones
    for (let k = 0; k < 6; k++) {
      const x1 = innerVertices[k].x;
      const y1 = innerVertices[k].y;
      const x2 = hex1.vertices[k].x;
      const y2 = hex1.vertices[k].y;
      
      const hue = (i * 37 + 90) % 360;
      stroke(hue, 90, 80, 0.6);
      strokeWeight(LINE_WEIGHT);
      line(x1, y1, x2, y2);
    }
  }
  
  noLoop(); // Static composition
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
