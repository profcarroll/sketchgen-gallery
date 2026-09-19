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

const grid = {
  rows: 9,
  cols: 18,
  cellWidth: 0,
  cellHeight: 0
};

let hueOffset = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  grid.cellWidth = width / grid.cols;
  grid.cellHeight = height / grid.rows;
}

function draw() {
  background(20);
  
  // Pulsing ambient light effect
  hueOffset = (hueOffset + 0.5) % 360;
  const baseHue = hueOffset;
  const glowIntensity = map(sin(frameCount * 0.02), -1, 1, 0.7, 1);
  
  // Draw the periodic table grid
  for (let i = 0; i < elements.length; i++) {
    const row = Math.floor(i / grid.cols);
    const col = i % grid.cols;
    
    if (row >= grid.rows) break;
    
    const x = col * grid.cellWidth;
    const y = row * grid.cellHeight;
    
    // Element tile with pulsing glow
    const elementHue = (baseHue + (i * 3)) % 360;
    fill(elementHue, 80, 90);
    noStroke();
    rect(x, y, grid.cellWidth, grid.cellHeight, 5);
    
    // Glow effect
    const glow = map(sin(frameCount * 0.02 + i), -1, 1, 30, 60) * glowIntensity;
    fill(elementHue, 70, 95, glow);
    rect(x, y, grid.cellWidth, grid.cellHeight, 5);
    
    // Element symbol
    fill(0);
    textSize(14);
    textAlign(CENTER, CENTER);
    text(elements[i], x + grid.cellWidth/2, y + grid.cellHeight/2);
  }
  
  // Continuous ambient glow overlay
  const ambientGlow = map(sin(frameCount * 0.01), -1, 1, 0.05, 0.15);
  fill(255, 255, 200, ambientGlow * 255);
  noStroke();
  rect(0, 0, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  grid.cellWidth = width / grid.cols;
  grid.cellHeight = height / grid.rows;
}
