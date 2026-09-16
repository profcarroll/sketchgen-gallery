let elements = [];
let gridWidth, gridHeight;
let cellSize = 60;
let hoverIndex = -1;
let animationOffset = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  gridWidth = floor((width - 200) / cellSize);
  gridHeight = floor((height - 200) / cellSize);

  // Create elements data
  const elementData = [
    { name: "Hydrogen", symbol: "H", group: 1, atomicNumber: 1 },
    { name: "Helium", symbol: "He", group: 18, atomicNumber: 2 },
    { name: "Lithium", symbol: "Li", group: 1, atomicNumber: 3 },
    { name: "Beryllium", symbol: "Be", group: 2, atomicNumber: 4 },
    { name: "Boron", symbol: "B", group: 13, atomicNumber: 5 },
    { name: "Carbon", symbol: "C", group: 14, atomicNumber: 6 },
    { name: "Nitrogen", symbol: "N", group: 15, atomicNumber: 7 },
    { name: "Oxygen", symbol: "O", group: 16, atomicNumber: 8 },
    { name: "Fluorine", symbol: "F", group: 17, atomicNumber: 9 },
    { name: "Neon", symbol: "Ne", group: 18, atomicNumber: 10 },
    { name: "Sodium", symbol: "Na", group: 1, atomicNumber: 11 },
    { name: "Magnesium", symbol: "Mg", group: 2, atomicNumber: 12 },
    { name: "Aluminum", symbol: "Al", group: 13, atomicNumber: 13 },
    { name: "Silicon", symbol: "Si", group: 14, atomicNumber: 14 },
    { name: "Phosphorus", symbol: "P", group: 15, atomicNumber: 15 },
    { name: "Sulfur", symbol: "S", group: 16, atomicNumber: 16 },
    { name: "Chlorine", symbol: "Cl", group: 17, atomicNumber: 17 },
    { name: "Argon", symbol: "Ar", group: 18, atomicNumber: 18 }
  ];

  for (let i = 0; i < elementData.length; i++) {
    const row = floor(i / gridWidth);
    const col = i % gridWidth;
    elements.push({
      ...elementData[i],
      x: 100 + col * cellSize,
      y: 100 + row * cellSize,
      originalX: 100 + col * cellSize,
      originalY: 100 + row * cellSize,
      expanded: false,
      color: color(
        map(i, 0, elementData.length, 50, 255),
        map(i, 0, elementData.length, 100, 200),
        map(i, 0, elementData.length, 200, 100)
      )
    });
  }
}

function draw() {
  background(240);
  animationOffset += 0.01;

  // Draw grid with subtle breathing animation
  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    const offsetX = sin(animationOffset + i * 0.1) * 2;
    const offsetY = cos(animationOffset + i * 0.1) * 2;

    // Apply animation offset
    el.x = el.originalX + offsetX;
    el.y = el.originalY + offsetY;

    // Draw element box
    fill(el.color);
    stroke(200);
    rect(el.x, el.y, cellSize, cellSize, 8);

    // Draw text
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(10);
    text(el.symbol, el.x + cellSize/2, el.y + cellSize/2 - 5);
    textSize(8);
    text(el.atomicNumber, el.x + cellSize/2, el.y + cellSize/2 + 5);

    // Highlight on hover
    if (hoverIndex === i) {
      fill(255, 100);
      rect(el.x, el.y, cellSize, cellSize, 8);
    }
  }
}

function mousePressed() {
  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    if (
      mouseX > el.x &&
      mouseX < el.x + cellSize &&
      mouseY > el.y &&
      mouseY < el.y + cellSize
    ) {
      // Toggle expansion
      elements[i].expanded = !elements[i].expanded;
      hoverIndex = i;
      return;
    }
  }

  // Reset if not clicking an element
  for (let i = 0; i < elements.length; i++) {
    elements[i].expanded = false;
  }
  hoverIndex = -1;
}

function mouseMoved() {
  let newHoverIndex = -1;
  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    if (
      mouseX > el.x &&
      mouseX < el.x + cellSize &&
      mouseY > el.y &&
      mouseY < el.y + cellSize
    ) {
      newHoverIndex = i;
      break;
    }
  }

  if (newHoverIndex !== hoverIndex) {
    hoverIndex = newHoverIndex;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
