let hexGrid = [];
const HEX_RADIUS = 60;
const LINE_WEIGHT = 1;
let time = 0;

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
  time += 0.01;
  
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
      
      // Add subtle warping to the line positions
      const x1 = hex1.vertices[idx1].x;
      const y1 = hex1.vertices[idx1].y;
      const x2 = hex1.vertices[idx2].x;
      const y2 = hex1.vertices[idx2].y;
      
      // Warp the line using noise-based displacement
      const displacement1 = noise(x1 * 0.01, y1 * 0.01, time) * 5;
      const displacement2 = noise(x2 * 0.01, y2 * 0.01, time) * 5;
      
      // Apply the displacement to create irregular warping
      const warpedX1 = x1 + displacement1 * Math.sin(time + i);
      const warpedY1 = y1 + displacement1 * Math.cos(time + i);
      const warpedX2 = x2 + displacement2 * Math.sin(time + i);
      const warpedY2 = y2 + displacement2 * Math.cos(time + i);
      
      // Use monochromatic shades of cyan and indigo
      const shade = map(i, 0, hexGrid.length, 40, 90);
      stroke(180, 100, shade, 0.8);
      strokeWeight(LINE_WEIGHT);
      line(warpedX1, warpedY1, warpedX2, warpedY2);
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
      
      // Add subtle warping to the inner lines
      const displacement1 = noise(x1 * 0.01, y1 * 0.01, time) * 3;
      const displacement2 = noise(x2 * 0.01, y2 * 0.01, time) * 3;
      
      const warpedX1 = x1 + displacement1 * Math.sin(time + i);
      const warpedY1 = y1 + displacement1 * Math.cos(time + i);
      const warpedX2 = x2 + displacement2 * Math.sin(time + i);
      const warpedY2 = y2 + displacement2 * Math.cos(time + i);
      
      const shade = map(i, 0, hexGrid.length, 30, 80);
      stroke(210, 100, shade, 0.7);
      strokeWeight(LINE_WEIGHT);
      line(warpedX1, warpedY1, warpedX2, warpedY2);
    }
    
    // Connect inner vertices to outer ones
    for (let k = 0; k < 6; k++) {
      const x1 = innerVertices[k].x;
      const y1 = innerVertices[k].y;
      const x2 = hex1.vertices[k].x;
      const y2 = hex1.vertices[k].y;
      
      // Add subtle warping to the connecting lines
      const displacement1 = noise(x1 * 0.01, y1 * 0.01, time) * 2;
      const displacement2 = noise(x2 * 0.01, y2 * 0.01, time) * 2;
      
      const warpedX1 = x1 + displacement1 * Math.sin(time + i);
      const warpedY1 = y1 + displacement1 * Math.cos(time + i);
      const warpedX2 = x2 + displacement2 * Math.sin(time + i);
      const warpedY2 = y2 + displacement2 * Math.cos(time + i);
      
      const shade = map(i, 0, hexGrid.length, 20, 70);
      stroke(195, 100, shade, 0.6);
      strokeWeight(LINE_WEIGHT);
      line(warpedX1, warpedY1, warpedX2, warpedY2);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
