let cells = [];
const maxCells = 1000;
const separationThreshold = 80;

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  frameRate(30);
}

function draw() {
  background(220, 5, 95);

  // Add new cells occasionally
  if (cells.length < maxCells && random() < 0.05) {
    cells.push({
      x: random(width),
      y: random(height),
      size: random(10, 30),
      hue: random(360),
      age: 0,
      isDividing: false,
      splitProgress: 0
    });
  }

  // Update and draw cells
  for (let i = cells.length - 1; i >= 0; i--) {
    const cell = cells[i];
    
    // Age the cell
    cell.age++;
    
    // Swelling phase
    if (!cell.isDividing && cell.age > 100 && random() < 0.01) {
      cell.isDividing = true;
      cell.splitProgress = 0;
    }
    
    // Splitting process
    if (cell.isDividing) {
      cell.splitProgress += 0.05;
      
      if (cell.splitProgress >= 1) {
        // Split into two cells
        const newSize = cell.size * 0.7;
        cells.push({
          x: cell.x + random(-20, 20),
          y: cell.y + random(-20, 20),
          size: newSize,
          hue: (cell.hue + random(-30, 30)) % 360,
          age: 0,
          isDividing: false,
          splitProgress: 0
        });
        
        cells.push({
          x: cell.x + random(-20, 20),
          y: cell.y + random(-20, 20),
          size: newSize,
          hue: (cell.hue + random(-30, 30)) % 360,
          age: 0,
          isDividing: false,
          splitProgress: 0
        });
        
        cells.splice(i, 1);
        continue;
      }
    }
    
    // Draw the cell with split effect if dividing
    const alpha = cell.isDividing ? map(cell.splitProgress, 0, 1, 0.3, 1) : 1;
    fill(cell.hue, 80, 90, alpha);
    
    if (cell.isDividing && cell.splitProgress > 0.5) {
      // Draw two separate cells during split
      const offset = map(cell.splitProgress, 0.5, 1, 0, 20);
      ellipse(cell.x - offset, cell.y, cell.size);
      ellipse(cell.x + offset, cell.y, cell.size);
    } else {
      // Normal cell drawing
      ellipse(cell.x, cell.y, cell.size);
    }
  }
}
