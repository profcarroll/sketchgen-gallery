let elements = [];
let highlightedElement = null;
let infoPanel = null;

function setup() {
  createCanvas(windowWidth, windowHeight);
  buildPeriodicTable();
  infoPanel = {
    x: width - 300,
    y: 50,
    w: 280,
    h: 200,
    visible: false
  };
}

function draw() {
  background(240);
  
  // Draw the grid of elements
  for (let element of elements) {
    drawElement(element);
  }
  
  // Draw info panel if needed
  if (infoPanel.visible && highlightedElement) {
    drawInfoPanel();
  }
}

function buildPeriodicTable() {
  const elementData = [
    { symbol: "H", number: 1, name: "Hydrogen", group: 1, period: 1 },
    { symbol: "He", number: 2, name: "Helium", group: 18, period: 1 },
    { symbol: "Li", number: 3, name: "Lithium", group: 1, period: 2 },
    { symbol: "Be", number: 4, name: "Beryllium", group: 2, period: 2 },
    { symbol: "B", number: 5, name: "Boron", group: 13, period: 2 },
    { symbol: "C", number: 6, name: "Carbon", group: 14, period: 2 },
    { symbol: "N", number: 7, name: "Nitrogen", group: 15, period: 2 },
    { symbol: "O", number: 8, name: "Oxygen", group: 16, period: 2 },
    { symbol: "F", number: 9, name: "Fluorine", group: 17, period: 2 },
    { symbol: "Ne", number: 10, name: "Neon", group: 18, period: 2 },
    { symbol: "Na", number: 11, name: "Sodium", group: 1, period: 3 },
    { symbol: "Mg", number: 12, name: "Magnesium", group: 2, period: 3 },
    { symbol: "Al", number: 13, name: "Aluminum", group: 13, period: 3 },
    { symbol: "Si", number: 14, name: "Silicon", group: 14, period: 3 },
    { symbol: "P", number: 15, name: "Phosphorus", group: 15, period: 3 },
    { symbol: "S", number: 16, name: "Sulfur", group: 16, period: 3 },
    { symbol: "Cl", number: 17, name: "Chlorine", group: 17, period: 3 },
    { symbol: "Ar", number: 18, name: "Argon", group: 18, period: 3 },
    { symbol: "K", number: 19, name: "Potassium", group: 1, period: 4 },
    { symbol: "Ca", number: 20, name: "Calcium", group: 2, period: 4 }
  ];

  const boxWidth = 60;
  const boxHeight = 80;
  const spacingX = 10;
  const spacingY = 10;
  const startX = (width - (boxWidth + spacingX) * 18) / 2;
  const startY = 50;

  for (let i = 0; i < elementData.length; i++) {
    let data = elementData[i];
    let row = data.period;
    let col = data.group;
    
    // Adjust for the fact that some elements don't follow strict grid
    if (data.symbol === "He") col = 18;
    if (data.symbol === "Ne") col = 18;
    if (data.symbol === "Ar") col = 18;
    
    let x = startX + (col - 1) * (boxWidth + spacingX);
    let y = startY + (row - 1) * (boxHeight + spacingY);
    
    elements.push({
      ...data,
      x: x,
      y: y,
      w: boxWidth,
      h: boxHeight
    });
  }
}

function drawElement(element) {
  const isHighlighted = element === highlightedElement;
  
  // Draw the box
  if (isHighlighted) {
    fill(255, 200, 100);
    stroke(255, 150, 50);
    strokeWeight(3);
  } else {
    fill(255);
    stroke(200);
    strokeWeight(1);
  }
  
  rect(element.x, element.y, element.w, element.h, 8);
  
  // Draw text
  textAlign(CENTER, TOP);
  textSize(14);
  fill(0);
  
  // Atomic number
  text(element.number, element.x + 10, element.y + 5);
  
  // Symbol
  textSize(20);
  text(element.symbol, element.x + element.w/2, element.y + 20);
  
  // Name (smaller)
  textSize(10);
  text(element.name, element.x + element.w/2, element.y + 45);
}

function drawInfoPanel() {
  fill(255, 240, 200);
  stroke(200, 150, 100);
  strokeWeight(2);
  rect(infoPanel.x, infoPanel.y, infoPanel.w, infoPanel.h, 10);
  
  fill(0);
  textAlign(LEFT, TOP);
  textSize(16);
  text("Element Details", infoPanel.x + 15, infoPanel.y + 15);
  
  textSize(12);
  text(`Symbol: ${highlightedElement.symbol}`, infoPanel.x + 15, infoPanel.y + 40);
  text(`Atomic Number: ${highlightedElement.number}`, infoPanel.x + 15, infoPanel.y + 55);
  text(`Name: ${highlightedElement.name}`, infoPanel.x + 15, infoPanel.y + 70);
  text(`Group: ${highlightedElement.group}`, infoPanel.x + 15, infoPanel.y + 85);
  text(`Period: ${highlightedElement.period}`, infoPanel.x + 15, infoPanel.y + 100);
}

function mousePressed() {
  // Check if click is on an element
  for (let element of elements) {
    if (mouseX > element.x && mouseX < element.x + element.w &&
        mouseY > element.y && mouseY < element.y + element.h) {
      highlightedElement = element;
      infoPanel.visible = true;
      return;
    }
  }
  
  // If click is not on any element, clear selection
  highlightedElement = null;
  infoPanel.visible = false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
