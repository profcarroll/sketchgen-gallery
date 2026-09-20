const elements = [
  // Period 1
  { symbol: 'H', name: 'Hydrogen', x: 0, y: 0 },
  { symbol: 'He', name: 'Helium', x: 17, y: 0 },
  // Period 2
  { symbol: 'Li', name: 'Lithium', x: 0, y: 1 },
  { symbol: 'Be', name: 'Beryllium', x: 1, y: 1 },
  { symbol: 'B', name: 'Boron', x: 12, y: 1 },
  { symbol: 'C', name: 'Carbon', x: 13, y: 1 },
  { symbol: 'N', name: 'Nitrogen', x: 14, y: 1 },
  { symbol: 'O', name: 'Oxygen', x: 15, y: 1 },
  { symbol: 'F', name: 'Fluorine', x: 16, y: 1 },
  { symbol: 'Ne', name: 'Neon', x: 17, y: 1 },
  // Period 3
  { symbol: 'Na', name: 'Sodium', x: 0, y: 2 },
  { symbol: 'Mg', name: 'Magnesium', x: 1, y: 2 },
  { symbol: 'Al', name: 'Aluminum', x: 12, y: 2 },
  { symbol: 'Si', name: 'Silicon', x: 13, y: 2 },
  { symbol: 'P', name: 'Phosphorus', x: 14, y: 2 },
  { symbol: 'S', name: 'Sulfur', x: 15, y: 2 },
  { symbol: 'Cl', name: 'Chlorine', x: 16, y: 2 },
  { symbol: 'Ar', name: 'Argon', x: 17, y: 2 },
  // Period 4
  { symbol: 'K', name: 'Potassium', x: 0, y: 3 },
  { symbol: 'Ca', name: 'Calcium', x: 1, y: 3 },
  { symbol: 'Sc', name: 'Scandium', x: 2, y: 3 },
  { symbol: 'Ti', name: 'Titanium', x: 3, y: 3 },
  { symbol: 'V', name: 'Vanadium', x: 4, y: 3 },
  { symbol: 'Cr', name: 'Chromium', x: 5, y: 3 },
  { symbol: 'Mn', name: 'Manganese', x: 6, y: 3 },
  { symbol: 'Fe', name: 'Iron', x: 7, y: 3 },
  { symbol: 'Co', name: 'Cobalt', x: 8, y: 3 },
  { symbol: 'Ni', name: 'Nickel', x: 9, y: 3 },
  { symbol: 'Cu', name: 'Copper', x: 10, y: 3 },
  { symbol: 'Zn', name: 'Zinc', x: 11, y: 3 },
  { symbol: 'Ga', name: 'Gallium', x: 12, y: 3 },
  { symbol: 'Ge', name: 'Germanium', x: 13, y: 3 },
  { symbol: 'As', name: 'Arsenic', x: 14, y: 3 },
  { symbol: 'Se', name: 'Selenium', x: 15, y: 3 },
  { symbol: 'Br', name: 'Bromine', x: 16, y: 3 },
  { symbol: 'Kr', name: 'Krypton', x: 17, y: 3 },
];

const tileWidth = 40;
const tileHeight = 40;
const padding = 10;
let glowAlpha = 0;
let glowDirection = 1;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
}

function draw() {
  background(0);

  // Animate glow
  glowAlpha += glowDirection * 0.02;
  if (glowAlpha > 1) {
    glowAlpha = 1;
    glowDirection = -1;
  } else if (glowAlpha < 0) {
    glowAlpha = 0;
    glowDirection = 1;
  }

  // Draw the grid with ambient glow
  const hueOffset = frameCount * 0.2 % 360;
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    const x = element.x * (tileWidth + padding) + padding;
    const y = element.y * (tileHeight + padding) + padding;

    // Glow effect
    fill(hueOffset, 50, 100, glowAlpha * 0.3);
    noStroke();
    rect(x - 2, y - 2, tileWidth + 4, tileHeight + 4, 8);

    // Element tile
    fill(hueOffset, 70, 90);
    stroke(0, 0, 100);
    strokeWeight(1);
    rect(x, y, tileWidth, tileHeight, 4);

    // Text
    fill(0, 0, 0);
    textSize(12);
    textAlign(CENTER, CENTER);
    text(element.symbol, x + tileWidth/2, y + tileHeight/2 - 2);
    textSize(8);
    text(element.name, x + tileWidth/2, y + tileHeight/2 + 10);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
