let grid = [];
let gridSize = 60;
let tileCount = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  generateGrid();
}

function draw() {
  background(255);
  
  // Draw the Bauhaus grid structure
  stroke(0);
  strokeWeight(1);
  
  for (let i = 0; i < grid.length; i++) {
    let tile = grid[i];
    
    // Draw the main tile
    fill(tile.color);
    rect(tile.x, tile.y, tile.w, tile.h);
    
    // Add structural lines
    strokeWeight(2);
    line(tile.x, tile.y, tile.x + tile.w, tile.y + tile.h);
    line(tile.x + tile.w, tile.y, tile.x, tile.y + tile.h);
    strokeWeight(1);
  }
  
  noLoop(); // Static composition as requested
}

function generateGrid() {
  grid = [];
  let cols = width / gridSize + 2;
  let rows = height / gridSize + 2;
  
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      // Create a tile with primary colors
      let colorChoice = (i + j) % 3;
      let c;
      switch(colorChoice) {
        case 0: c = color(255, 0, 0); break; // Red
        case 1: c = color(0, 0, 255); break; // Blue
        case 2: c = color(255, 255, 0); break; // Yellow
      }
      
      grid.push({
        x: i * gridSize,
        y: j * gridSize,
        w: gridSize,
        h: gridSize,
        color: c
      });
      
      tileCount++;
    }
  }
}
