let grid;
let borderSize = 100;
let tileSize = 40;
let flowerSize = 20;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noLoop();
  
  // Create a grid of tiles
  let cols = Math.ceil((width - borderSize * 2) / tileSize);
  let rows = Math.ceil((height - borderSize * 2) / tileSize);
  grid = new Array(cols);
  for (let i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
    for (let j = 0; j < rows; j++) {
      grid[i][j] = {
        x: borderSize + i * tileSize,
        y: borderSize + j * tileSize,
        flower: createFlower(i, j)
      };
    }
  }
}

function draw() {
  background(0);
  
  // Draw border
  drawBorder();
  
  // Draw grid with flowers
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      let tile = grid[i][j];
      push();
      translate(tile.x, tile.y);
      tile.flower.draw();
      pop();
    }
  }
}

function drawBorder() {
  // Draw rhombus border
  stroke(0);
  strokeWeight(2);
  noFill();
  
  // Top border
  beginShape();
  vertex(borderSize, borderSize);
  vertex(width - borderSize, borderSize);
  vertex(width - borderSize, borderSize + 20);
  vertex(borderSize, borderSize + 20);
  endShape(CLOSE);
  
  // Bottom border
  beginShape();
  vertex(borderSize, height - borderSize);
  vertex(width - borderSize, height - borderSize);
  vertex(width - borderSize, height - borderSize - 20);
  vertex(borderSize, height - borderSize - 20);
  endShape(CLOSE);
  
  // Left border
  beginShape();
  vertex(borderSize, borderSize);
  vertex(borderSize + 20, borderSize);
  vertex(borderSize + 20, height - borderSize);
  vertex(borderSize, height - borderSize);
  endShape(CLOSE);
  
  // Right border
  beginShape();
  vertex(width - borderSize, borderSize);
  vertex(width - borderSize - 20, borderSize);
  vertex(width - borderSize - 20, height - borderSize);
  vertex(width - borderSize, height - borderSize);
  endShape(CLOSE);
}

function createFlower(i, j) {
  return {
    draw: function() {
      // Create a stylized flower pattern
      let hue = (i * 30 + j * 20) % 360;
      
      // Draw petals
      for (let a = 0; a < 6; a++) {
        push();
        rotate(TWO_PI / 6 * a);
        fill(hue, 80, 70);
        noStroke();
        ellipse(0, -flowerSize/2, flowerSize, flowerSize/3);
        pop();
      }
      
      // Draw center
      fill(hue + 120, 90, 50);
      ellipse(0, 0, flowerSize/2, flowerSize/2);
    }
  };
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
