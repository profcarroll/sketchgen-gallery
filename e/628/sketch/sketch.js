let grid = [];
let cellSize = 40;
let rows, cols;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  rows = ceil(height / cellSize);
  cols = ceil(width / cellSize);
  
  // Precompute grid points for the curved pathway
  for (let i = 0; i < rows; i++) {
    grid[i] = [];
    for (let j = 0; j < cols; j++) {
      let x = (j - cols/2) * cellSize;
      let y = (i - rows/2) * cellSize;
      
      // Create a curved, flowing structure
      let z = sin(j * 0.1 + frameCount * 0.01) * cos(i * 0.1) * 100;
      
      // Add some variation to simulate rust and texture
      z += noise(j * 0.05, i * 0.05, frameCount * 0.001) * 30;
      
      grid[i][j] = { x, y, z };
    }
  }
}

function draw() {
  background(0);
  
  // Camera position to view the structure from an angle
  camera(0, -height/2, height, 0, 0, 0, 0, 1, 0);
  
  // Lighting setup for metallic look
  pointLight(255, 255, 255, width/2, -height/2, 300);
  ambientLight(50);
  
  // Draw the curved pathway structure
  strokeWeight(1);
  noFill();
  
  beginShape(TRIANGLES);
  
  for (let i = 0; i < rows - 1; i++) {
    for (let j = 0; j < cols - 1; j++) {
      let a = grid[i][j];
      let b = grid[i][j+1];
      let c = grid[i+1][j];
      let d = grid[i+1][j+1];
      
      // Create some irregularity in the structure to simulate rust and wear
      if (noise(a.x * 0.01, a.y * 0.01) > 0.7) {
        stroke(100, 40, 0); // Deep ochre
      } else {
        stroke(80, 30, 0); // Rich umber
      }
      
      vertex(a.x, a.y, a.z);
      vertex(b.x, b.y, b.z);
      vertex(c.x, c.y, c.z);
      
      vertex(b.x, b.y, b.z);
      vertex(c.x, c.y, c.z);
      vertex(d.x, d.y, d.z);
    }
  }
  
  endShape();
  
  // Draw mineral runoff channels
  stroke(50, 20, 0);
  strokeWeight(1);
  
  beginShape(LINES);
  
  for (let i = 0; i < rows - 1; i++) {
    for (let j = 0; j < cols - 1; j++) {
      if (noise(i * 0.1, j * 0.1, frameCount * 0.01) > 0.8) {
        let a = grid[i][j];
        let b = grid[i][j+1];
        
        vertex(a.x, a.y, a.z);
        vertex(b.x, b.y, b.z);
      }
    }
  }
  
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
