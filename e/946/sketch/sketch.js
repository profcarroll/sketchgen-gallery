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
  'Md', 'No', 'Lr', 'Rf', 'Db', 'Sg', 'Bh', 'Hs', 'Mt', 'Ds',
  'Rg', 'Cn', 'Nh', 'Fl', 'Mc', 'Lv', 'Ts', 'Og'
];

const gridSize = 12;
const cellSize = 40;
let glowIntensity = 0;
let pulseDirection = 1;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
}

function draw() {
  background(0);
  
  // Update glow intensity
  glowIntensity += pulseDirection * 0.02;
  if (glowIntensity > 1) {
    glowIntensity = 1;
    pulseDirection = -1;
  } else if (glowIntensity < 0) {
    glowIntensity = 0;
    pulseDirection = 1;
  }
  
  // Draw pulsating glow
  const glowRadius = 300 + sin(frameCount * 0.02) * 50;
  drawGlow(glowRadius);
  
  // Draw periodic table grid
  drawGrid();
}

function drawGlow(radius) {
  const hue = (frameCount * 0.5) % 360;
  fill(hue, 100, 100, 0.1 * glowIntensity);
  noStroke();
  ellipse(width/2, height/2, radius * 2);
}

function drawGrid() {
  const startX = (width - gridSize * cellSize) / 2;
  const startY = (height - gridSize * cellSize) / 2;
  
  for (let i = 0; i < elements.length && i < gridSize * gridSize; i++) {
    const row = floor(i / gridSize);
    const col = i % gridSize;
    
    const x = startX + col * cellSize;
    const y = startY + row * cellSize;
    
    // Base color with slight variation
    const baseHue = (frameCount * 0.2 + i * 5) % 360;
    fill(baseHue, 80, 90);
    
    // Draw element cell
    rect(x, y, cellSize - 2, cellSize - 2, 5);
    
    // Draw element symbol
    fill(0);
    textSize(14);
    textAlign(CENTER, CENTER);
    text(elements[i], x + cellSize/2, y + cellSize/2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
