let hexGrid = [];
const HEX_RADIUS = 60;
const LINE_COLOR = [180, 80, 90]; // Cyan to indigo
const GRID_SIZE = 20;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create hexagonal grid points
  const cols = Math.ceil(width / (HEX_RADIUS * 1.5)) + 2;
  const rows = Math.ceil(height / (HEX_RADIUS * sqrt(3))) + 2;
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * HEX_RADIUS * 1.5;
      const y = row * HEX_RADIUS * sqrt(3);
      
      // Offset every other row
      if (row % 2 === 1) {
        hexGrid.push({x: x + HEX_RADIUS * 0.75, y});
      } else {
        hexGrid.push({x, y});
      }
    }
  }
}

function draw() {
  background(0, 0, 5, 1);
  
  // Draw connections between hexagon centers
  stroke(LINE_COLOR[0], LINE_COLOR[1], LINE_COLOR[2]);
  strokeWeight(1);
  noFill();
  
  // Draw hexagonal motifs with fixed geometry
  for (let i = 0; i < hexGrid.length; i++) {
    const center = hexGrid[i];
    
    // Draw a hexagon motif at each grid point
    push();
    translate(center.x, center.y);
    
    // Draw the six sides of the hexagon
    beginShape();
    for (let j = 0; j < 6; j++) {
      const angle = TWO_PI * j / 6;
      const x = HEX_RADIUS * cos(angle);
      const y = HEX_RADIUS * sin(angle);
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Draw internal hexagon lines
    for (let k = 0; k < 6; k++) {
      const angle1 = TWO_PI * k / 6;
      const angle2 = TWO_PI * (k + 2) / 6;
      
      const x1 = HEX_RADIUS * cos(angle1);
      const y1 = HEX_RADIUS * sin(angle1);
      const x2 = HEX_RADIUS * cos(angle2);
      const y2 = HEX_RADIUS * sin(angle2);
      
      line(x1, y1, x2, y2);
    }
    
    pop();
  }
  
  // Draw connecting lines between adjacent hexagons
  strokeWeight(0.5);
  for (let i = 0; i < hexGrid.length; i++) {
    const a = hexGrid[i];
    
    for (let j = i + 1; j < hexGrid.length; j++) {
      const b = hexGrid[j];
      
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const distance = sqrt(dx * dx + dy * dy);
      
      // Connect if they're close enough (within grid spacing)
      if (distance < HEX_RADIUS * 1.5) {
        line(a.x, a.y, b.x, b.y);
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
