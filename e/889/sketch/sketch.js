const elements = [
  { symbol: 'H', number: 1, mass: 1.008, group: 1, config: '1s¹', x: 0, y: 0 },
  { symbol: 'He', number: 2, mass: 4.0026, group: 18, config: '1s²', x: 1, y: 0 },
  { symbol: 'Li', number: 3, mass: 6.94, group: 1, config: '1s² 2s¹', x: 0, y: 1 },
  { symbol: 'Be', number: 4, mass: 9.0122, group: 2, config: '1s² 2s²', x: 1, y: 1 },
  { symbol: 'B', number: 5, mass: 10.81, group: 13, config: '1s² 2s² 2p¹', x: 2, y: 1 },
  { symbol: 'C', number: 6, mass: 12.011, group: 14, config: '1s² 2s² 2p²', x: 3, y: 1 },
  { symbol: 'N', number: 7, mass: 14.007, group: 15, config: '1s² 2s² 2p³', x: 4, y: 1 },
  { symbol: 'O', number: 8, mass: 15.999, group: 16, config: '1s² 2s² 2p⁴', x: 5, y: 1 },
  { symbol: 'F', number: 9, mass: 18.998, group: 17, config: '1s² 2s² 2p⁵', x: 6, y: 1 },
  { symbol: 'Ne', number: 10, mass: 20.180, group: 18, config: '1s² 2s² 2p⁶', x: 7, y: 1 },
  { symbol: 'Na', number: 11, mass: 22.990, group: 1, config: '1s² 2s² 2p⁶ 3s¹', x: 0, y: 2 },
  { symbol: 'Mg', number: 12, mass: 24.305, group: 2, config: '1s² 2s² 2p⁶ 3s²', x: 1, y: 2 },
  { symbol: 'Al', number: 13, mass: 26.982, group: 13, config: '1s² 2s² 2p⁶ 3s² 3p¹', x: 2, y: 2 },
  { symbol: 'Si', number: 14, mass: 28.085, group: 14, config: '1s² 2s² 2p⁶ 3s² 3p²', x: 3, y: 2 },
  { symbol: 'P', number: 15, mass: 30.974, group: 15, config: '1s² 2s² 2p⁶ 3s² 3p³', x: 4, y: 2 },
  { symbol: 'S', number: 16, mass: 32.06, group: 16, config: '1s² 2s² 2p⁶ 3s² 3p⁴', x: 5, y: 2 },
  { symbol: 'Cl', number: 17, mass: 35.45, group: 17, config: '1s² 2s² 2p⁶ 3s² 3p⁵', x: 6, y: 2 },
  { symbol: 'Ar', number: 18, mass: 39.948, group: 18, config: '1s² 2s² 2p⁶ 3s² 3p⁶', x: 7, y: 2 }
];

let gridWidth = 8;
let gridHeight = 3;
let cellSize = 60;
let offsetX = 50;
let offsetY = 50;
let pulse = 0;
let selectedElement = null;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  textSize(12);
  noStroke();
}

function draw() {
  background(240);
  
  // Update pulse animation
  pulse = (sin(frameCount * 0.05) + 1) * 0.1;
  
  // Draw grid of elements
  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    const x = offsetX + el.x * cellSize;
    const y = offsetY + el.y * cellSize;
    
    // Base color based on group
    let baseColor;
    switch(el.group) {
      case 1: baseColor = color(255, 100, 100); break;   // Alkali metals
      case 2: baseColor = color(100, 200, 255); break;   // Alkaline earth
      case 13: baseColor = color(200, 200, 100); break;  // Boron group
      case 14: baseColor = color(100, 200, 100); break;  // Carbon group
      case 15: baseColor = color(150, 100, 200); break;  // Nitrogen group
      case 16: baseColor = color(255, 200, 100); break;  // Oxygen group
      case 17: baseColor = color(100, 255, 200); break;  // Halogens
      case 18: baseColor = color(150, 150, 150); break;  // Noble gases
      default: baseColor = color(200);
    }
    
    let drawColor = baseColor;
    if (selectedElement && selectedElement.number === el.number) {
      drawColor = lerpColor(drawColor, color(255), 0.7);
    } else {
      drawColor = lerpColor(drawColor, color(255), pulse);
    }
    
    fill(drawColor);
    rect(x, y, cellSize * 0.8, cellSize * 0.8);
    
    // Draw element info
    fill(0);
    textSize(10);
    text(el.number, x - 10, y - 10);
    text(el.symbol, x, y);
    
    if (selectedElement && selectedElement.number === el.number) {
      textSize(8);
      text(el.mass.toFixed(3), x, y + 15);
      text(el.config, x, y + 25);
    }
  }
  
  // Draw connections between related elements
  stroke(200, 150);
  strokeWeight(0.5);
  noFill();
  
  for (let i = 0; i < elements.length; i++) {
    const el1 = elements[i];
    
    // Connect to neighbors in same group
    for (let j = i + 1; j < elements.length; j++) {
      const el2 = elements[j];
      
      if (el1.group === el2.group && abs(el1.x - el2.x) <= 1) {
        const x1 = offsetX + el1.x * cellSize;
        const y1 = offsetY + el1.y * cellSize;
        const x2 = offsetX + el2.x * cellSize;
        const y2 = offsetY + el2.y * cellSize;
        
        line(x1, y1, x2, y2);
      }
    }
  }
}

function mousePressed() {
  let mouseX = pmouseX;
  let mouseY = pmouseY;
  
  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    const x = offsetX + el.x * cellSize;
    const y = offsetY + el.y * cellSize;
    
    if (dist(mouseX, mouseY, x, y) < cellSize * 0.4) {
      selectedElement = el;
      return;
    }
  }
  
  // If clicked outside any element, deselect
  selectedElement = null;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
