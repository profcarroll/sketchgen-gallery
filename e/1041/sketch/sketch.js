let grid = [];
let cols, rows;
let cellSize;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Define periodic table elements (simplified)
  const elements = [
    'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne',
    'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca',
    'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn',
    'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr', 'Rb', 'Sr', 'Y', 'Zr',
    'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn',
    'Sb', 'Te', 'I', 'Xe', 'Cs', 'Ba', 'La', 'Ce', 'Pr', 'Nd',
    'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb',
    'Lu', 'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg',
    'Tl', 'Pb', 'Bi', 'Po', 'At', 'Rn', 'Fr', 'Ra', 'Ac', 'Th',
    'Pa', 'U', 'Np', 'Pu', 'Am', 'Cm', 'Bk', 'Cf', 'Es', 'Fm',
    'Md', 'No', 'Lr'
  ];
  
  // Calculate grid dimensions
  cols = 10;
  rows = Math.ceil(elements.length / cols);
  cellSize = min(width / cols, height / rows) * 0.8;
  
  // Create grid with elements
  for (let i = 0; i < elements.length; i++) {
    const row = floor(i / cols);
    const col = i % cols;
    grid.push({
      element: elements[i],
      x: col * cellSize + cellSize/2,
      y: row * cellSize + cellSize/2,
      hue: map(i, 0, elements.length, 0, 360)
    });
  }
}

function draw() {
  background(0);
  time += 0.02;
  
  // Draw glow effect
  for (let i = 0; i < grid.length; i++) {
    const cell = grid[i];
    const wave = sin(time + cell.x * 0.01 + cell.y * 0.01) * 0.5 + 0.5;
    
    // Glow intensity based on sine wave
    const glowIntensity = map(wave, 0, 1, 0.2, 0.8);
    
    // Draw element with glow
    push();
    translate(cell.x, cell.y);
    
    // Ambient glow
    noStroke();
    fill(cell.hue, 70, 90, glowIntensity);
    ellipse(0, 0, cellSize * 0.8, cellSize * 0.8);
    
    // Element text
    fill(0);
    textSize(cellSize * 0.3);
    textAlign(CENTER, CENTER);
    text(cell.element, 0, 0);
    
    pop();
  }
  
  // Draw traveling wave lines
  stroke(255, 0.1);
  noFill();
  beginShape();
  for (let i = 0; i < cols; i++) {
    const x = i * cellSize + cellSize/2;
    const y = height/2 + sin(time + i * 0.3) * 50;
    vertex(x, y);
  }
  endShape();
  
  // Draw another wave from the other side
  beginShape();
  for (let i = 0; i < cols; i++) {
    const x = i * cellSize + cellSize/2;
    const y = height/2 + sin(time + i * 0.3 + PI) * 50;
    vertex(x, y);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
