let patternGrid = [];
let tileSize = 40;
let cols, rows;
let hueOffset = 0;

function setup() {
  createCanvas(600, 600);
  cols = floor(width / tileSize);
  rows = floor(height / tileSize);

  // Precompute the pattern grid
  for (let y = 0; y < rows; y++) {
    patternGrid[y] = [];
    for (let x = 0; x < cols; x++) {
      patternGrid[y][x] = {
        type: floor(random(3)),
        rotation: random(TWO_PI)
      };
    }
  }

  noLoop();
}

function draw() {
  background(20);
  
  // Draw the main textile pattern
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      push();
      translate(x * tileSize + tileSize/2, y * tileSize + tileSize/2);
      
      // Apply rotation based on grid position
      let rot = patternGrid[y][x].rotation;
      rotate(rot);
      
      // Draw different motifs based on type
      switch(patternGrid[y][x].type) {
        case 0: // Floral motif
          drawFloral();
          break;
        case 1: // Geometric knotwork
          drawKnotwork();
          break;
        case 2: // Interlocking rhombuses
          drawRhombusPattern();
          break;
      }
      
      pop();
    }
  }

  // Draw border bands
  drawBorder();
}

function drawFloral() {
  noStroke();
  fill(180, 60, 70);
  ellipse(0, 0, tileSize * 0.4);
  
  fill(220, 100, 100);
  for (let i = 0; i < 5; i++) {
    let angle = i * TWO_PI / 5;
    ellipse(cos(angle) * tileSize * 0.3, sin(angle) * tileSize * 0.3, tileSize * 0.2);
  }
  
  fill(150, 40, 50);
  for (let i = 0; i < 8; i++) {
    let angle = i * TWO_PI / 8;
    ellipse(cos(angle) * tileSize * 0.2, sin(angle) * tileSize * 0.2, tileSize * 0.1);
  }
}

function drawKnotwork() {
  stroke(120, 80, 150);
  strokeWeight(tileSize * 0.05);
  noFill();
  
  // Draw interlocking loops
  beginShape();
  for (let i = 0; i < 12; i++) {
    let angle = i * TWO_PI / 12;
    let x = cos(angle) * tileSize * 0.3;
    let y = sin(angle) * tileSize * 0.3;
    vertex(x, y);
  }
  endShape(CLOSE);
  
  // Inner loop
  beginShape();
  for (let i = 0; i < 8; i++) {
    let angle = i * TWO_PI / 8 + PI/8;
    let x = cos(angle) * tileSize * 0.15;
    let y = sin(angle) * tileSize * 0.15;
    vertex(x, y);
  }
  endShape(CLOSE);
}

function drawRhombusPattern() {
  noStroke();
  fill(80, 100, 180);
  
  // Draw rhombuses in a grid
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      push();
      translate((i - 1) * tileSize * 0.2, (j - 1) * tileSize * 0.2);
      
      // Draw a rhombus
      beginShape();
      vertex(0, -tileSize * 0.15);
      vertex(tileSize * 0.15, 0);
      vertex(0, tileSize * 0.15);
      vertex(-tileSize * 0.15, 0);
      endShape(CLOSE);
      
      pop();
    }
  }
}

function drawBorder() {
  // Top and bottom borders
  noStroke();
  fill(60, 80, 120);
  rect(0, 0, width, 20);
  rect(0, height - 20, width, 20);

  // Side borders
  rect(0, 0, 20, height);
  rect(width - 20, 0, 20, height);
  
  // Chevron patterns on borders
  stroke(100, 150, 200);
  strokeWeight(3);
  noFill();
  
  // Top border chevrons
  for (let x = 0; x < width; x += 40) {
    beginShape();
    vertex(x, 20);
    vertex(x + 20, 0);
    vertex(x + 40, 20);
    endShape();
  }
  
  // Bottom border chevrons
  for (let x = 0; x < width; x += 40) {
    beginShape();
    vertex(x, height - 20);
    vertex(x + 20, height);
    vertex(x + 40, height - 20);
    endShape();
  }
}
